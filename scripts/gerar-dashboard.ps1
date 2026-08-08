Write-Host ""
Write-Host "==============================="
Write-Host "GERANDO DASHBOARD"
Write-Host "==============================="

# ============================================================
# DEFINE O PERÍODO FECHADO DA SEMANA
# Segunda-feira até domingo
# ============================================================

$hoje = (Get-Date).Date

# Localiza o domingo mais recente
$fimPeriodo = $hoje.AddDays(-([int]$hoje.DayOfWeek))

# Se o script for executado no próprio domingo,
# considera o domingo anterior para evitar semana incompleta
if ($hoje.DayOfWeek -eq [System.DayOfWeek]::Sunday) {
    $fimPeriodo = $fimPeriodo.AddDays(-7)
}

$inicioPeriodo = $fimPeriodo.AddDays(-6)

Write-Host ""
Write-Host "Período analisado:"
Write-Host "$($inicioPeriodo.ToString('dd/MM/yyyy')) a $($fimPeriodo.ToString('dd/MM/yyyy'))"
Write-Host ""

# ============================================================
# LOCALIZA OS ARQUIVOS DO HISTÓRICO
# ============================================================

$arquivos = Get-ChildItem "historico" -Filter *.json |
    Where-Object {
        $_.Name -ne "dashboard.json"
    } |
    ForEach-Object {

        try {

            $json = Get-Content $_.FullName -Raw | ConvertFrom-Json

            if (-not $json.data) {
                return
            }

            $dataExecucao = [datetime]::ParseExact(
                $json.data,
                "yyyy-MM-dd",
                [System.Globalization.CultureInfo]::InvariantCulture
            )

            if (
                $dataExecucao.Date -ge $inicioPeriodo -and
                $dataExecucao.Date -le $fimPeriodo
            ) {

                [PSCustomObject]@{
                    Arquivo = $_
                    Json = $json
                    DataExecucao = $dataExecucao
                }

            }

        }
        catch {

            Write-Warning "Não foi possível processar o arquivo $($_.Name): $($_.Exception.Message)"

        }

    } |
    Sort-Object DataExecucao

# ============================================================
# ESTRUTURAS
# ============================================================

$historico = @()
$todasFalhas = @()

# ============================================================
# VARIÁVEIS DO RESUMO
# ============================================================

$dias = 0
$total = 0
$aprovados = 0
$falhas = 0
$diasComFalha = 0
$somaSucesso = 0

$primeiroDia = $null
$ultimoDia = $null
$piorDia = $null

# ============================================================
# INDICADORES DA SEMANA
# ============================================================

$sequenciaAtualSemFalhas = 0
$maiorSequenciaSemFalhas = 0
$execucaoPerfeita = $false

# ============================================================
# PROCESSA CADA EXECUÇÃO
# ============================================================

foreach ($itemArquivo in $arquivos) {

    $json = $itemArquivo.Json

    if ($null -eq $primeiroDia) {
        $primeiroDia = $json
    }

    $ultimoDia = $json

    # Coleta as falhas detalhadas
    if ($json.topFalhas) {

        foreach ($falhaItem in $json.topFalhas) {
            $todasFalhas += $falhaItem
        }

    }

    # Adiciona a execução ao histórico
    $historico += @{
        data = $json.data
        hora = $json.hora
        total = [int]$json.total
        passed = [int]$json.passed
        failed = [int]$json.failed
        successRate = [double]$json.successRate
    }

    # Alimenta o resumo
    $dias++
    $total += [int]$json.total
    $aprovados += [int]$json.passed
    $falhas += [int]$json.failed
    $somaSucesso += [double]$json.successRate

    # Dias com falha e sequência sem falhas
    if ([int]$json.failed -gt 0) {

        $diasComFalha++
        $sequenciaAtualSemFalhas = 0

    }
    else {

        $execucaoPerfeita = $true
        $sequenciaAtualSemFalhas++

        if ($sequenciaAtualSemFalhas -gt $maiorSequenciaSemFalhas) {
            $maiorSequenciaSemFalhas = $sequenciaAtualSemFalhas
        }

    }

    # Identifica o pior dia
    if (
        $null -eq $piorDia -or
        [double]$json.successRate -lt [double]$piorDia.successRate
    ) {

        $piorDia = $json

    }

}

# ============================================================
# MÉDIA DE SUCESSO
# ============================================================

if ($dias -eq 0) {

    $mediaSucesso = 0

}
else {

    $mediaSucesso = [math]::Round(
        $somaSucesso / $dias,
        2
    )

}

# ============================================================
# TENDÊNCIA DA QUALIDADE
# ============================================================

$variacao = 0
$statusTendencia = "ESTAVEL"

if ($primeiroDia -and $ultimoDia) {

    $variacao = [math]::Round(
        (
            [double]$ultimoDia.successRate -
            [double]$primeiroDia.successRate
        ),
        2
    )

    if ($variacao -gt 0) {

        $statusTendencia = "MELHORANDO"

    }
    elseif ($variacao -lt 0) {

        $statusTendencia = "PIORANDO"

    }

}

# ============================================================
# PROTEÇÃO PARA HISTÓRICO VAZIO
# ============================================================

if ($null -eq $piorDia) {

    $piorDia = @{
        data = "-"
        successRate = 0
    }

}

# ============================================================
# RANKING DAS FALHAS MAIS RECORRENTES
# ============================================================

$rankingFalhas = @()

if ($todasFalhas.Count -gt 0) {

    $rankingFalhas =
        $todasFalhas |
        Group-Object suite, cenario |
        Sort-Object Count -Descending |
        ForEach-Object {

            @{
                suite = $_.Group[0].suite
                cenario = $_.Group[0].cenario
                quantidade = $_.Count
                ultimoErro = $_.Group[-1].erro
            }

        }

}

# ============================================================
# FALHA MAIS RECORRENTE
# ============================================================

$falhaMaisRecorrente = @{
    suite = "-"
    cenario = "Nenhuma falha registrada"
    quantidade = 0
}

if ($rankingFalhas.Count -gt 0) {

    $falhaMaisRecorrente = @{
        suite = $rankingFalhas[0].suite
        cenario = $rankingFalhas[0].cenario
        quantidade = $rankingFalhas[0].quantidade
    }

}

# ============================================================
# MÓDULO / SUÍTE MAIS INSTÁVEL
# ============================================================

$moduloMaisInstavel = @{
    nome = "-"
    falhas = 0
}

if ($todasFalhas.Count -gt 0) {

    $grupoModulo =
        $todasFalhas |
        Group-Object suite |
        Sort-Object Count -Descending |
        Select-Object -First 1

    if ($grupoModulo) {

        $moduloMaisInstavel = @{
            nome = $grupoModulo.Name
            falhas = $grupoModulo.Count
        }

    }

}

# ============================================================
# OBJETO FINAL DO DASHBOARD
# ============================================================

$dashboard = @{

    periodo = @{
        inicio = $inicioPeriodo.ToString("yyyy-MM-dd")
        fim = $fimPeriodo.ToString("yyyy-MM-dd")
    }

    resumo = @{

        dias = $dias
        cenarios = $total
        aprovados = $aprovados
        falhas = $falhas
        diasComFalha = $diasComFalha
        sucesso = $mediaSucesso

        piorDia = @{
            data = $piorDia.data
            sucesso = $piorDia.successRate
        }

        tendencia = @{
            status = $statusTendencia
            variacao = $variacao
        }

    }

    historico = $historico

    rankingFalhas = $rankingFalhas

    insights = @{

        falhaMaisRecorrente = $falhaMaisRecorrente

        moduloMaisInstavel = $moduloMaisInstavel

        maiorSequenciaSemFalhas = $maiorSequenciaSemFalhas

        execucaoPerfeita = $execucaoPerfeita

    }

}

# ============================================================
# SALVA O DASHBOARD
# ============================================================

$dashboard |
    ConvertTo-Json -Depth 6 |
    Set-Content "historico/dashboard.json" -Encoding UTF8

# ============================================================
# RESUMO NO TERMINAL
# ============================================================

Write-Host ""
Write-Host "==============================="
Write-Host "DASHBOARD GERADO COM SUCESSO"
Write-Host "==============================="
Write-Host "Arquivo             : historico/dashboard.json"
Write-Host "Período             : $($inicioPeriodo.ToString('dd/MM/yyyy')) a $($fimPeriodo.ToString('dd/MM/yyyy'))"
Write-Host "Dias analisados     : $dias"
Write-Host "Total de cenários   : $total"
Write-Host "Dias com falha      : $diasComFalha"
Write-Host "Falhas semanais     : $falhas"
Write-Host "Taxa média          : $mediaSucesso%"
Write-Host "Pior dia            : $($piorDia.data) - $($piorDia.successRate)%"
Write-Host "Sequência sem falha : $maiorSequenciaSemFalhas dia(s)"
Write-Host "Módulo instável     : $($moduloMaisInstavel.nome)"
Write-Host "Falha recorrente    : $($falhaMaisRecorrente.cenario)"
Write-Host ""