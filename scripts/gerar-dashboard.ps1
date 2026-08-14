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

# Se executar no domingo, usa a semana anterior completa
if ($hoje.DayOfWeek -eq [System.DayOfWeek]::Sunday) {
    $fimPeriodo = $fimPeriodo.AddDays(-7)
}

$inicioPeriodo = $fimPeriodo.AddDays(-6)

Write-Host ""
Write-Host "Periodo semanal analisado:"
Write-Host "$($inicioPeriodo.ToString('dd/MM/yyyy')) a $($fimPeriodo.ToString('dd/MM/yyyy'))"
Write-Host ""

# ============================================================
# LOCALIZA TODOS OS ARQUIVOS DIÁRIOS
# ============================================================

$arquivosTodos = Get-ChildItem "historico" -Filter *.json |
    Where-Object {
        $_.Name -ne "dashboard.json" -and
        $_.Name -ne "historico-completo.json"
    } |
    ForEach-Object {

        try {

            $json = Get-Content $_.FullName -Raw -Encoding UTF8 |
                ConvertFrom-Json

            if (-not $json.data) {
                return
            }

            $dataExecucao = [datetime]::ParseExact(
                $json.data,
                "yyyy-MM-dd",
                [System.Globalization.CultureInfo]::InvariantCulture
            )

            [PSCustomObject]@{
                Arquivo = $_
                Json = $json
                DataExecucao = $dataExecucao
            }

        }
        catch {

            Write-Warning "Nao foi possivel processar o arquivo $($_.Name): $($_.Exception.Message)"

        }

    } |
    Sort-Object DataExecucao

# ============================================================
# GERA HISTÓRICO COMPLETO
# ============================================================

$historicoCompleto = @()

foreach ($itemArquivo in $arquivosTodos) {

    $json = $itemArquivo.Json

    # Normaliza topFalhas
    $topFalhasNormalizado = @()

    if ($json.topFalhas) {

        # Compatibilidade com formato antigo:
        # topFalhas = { value: [...], Count: X }
        if ($null -ne $json.topFalhas.value) {

            $topFalhasNormalizado =
                @($json.topFalhas.value) |
                Where-Object { $null -ne $_ }

        }
        else {

            $topFalhasNormalizado =
                @($json.topFalhas) |
                Where-Object { $null -ne $_ }

        }

    }

    $historicoCompleto += @{
        data = $json.data
        hora = $json.hora

        total = [int]$json.total
        passed = [int]$json.passed
        failed = [int]$json.failed

        successRate = [double]$json.successRate

        homepage = [double]$json.homepage
        portal = [double]$json.portal
        perfil = [double]$json.perfil

        status = $json.status

        topFalhas = $topFalhasNormalizado
    }

}

$historicoCompleto |
    ConvertTo-Json -Depth 8 |
    Set-Content "historico/historico-completo.json" -Encoding UTF8

Write-Host ""
Write-Host "Historico completo gerado:"
Write-Host "historico/historico-completo.json"
Write-Host "Execucoes armazenadas: $($historicoCompleto.Count)"
Write-Host ""

# ============================================================
# FILTRA SOMENTE A SEMANA ATUAL DO RELATÓRIO
# ============================================================

$arquivos = $arquivosTodos |
    Where-Object {
        $_.DataExecucao.Date -ge $inicioPeriodo -and
        $_.DataExecucao.Date -le $fimPeriodo
    }

# ============================================================
# ESTRUTURAS DO DASHBOARD SEMANAL
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

# ============================================================
# SAÚDE POR MÓDULO
# ============================================================

$somaHomepage = 0
$somaPortal = 0
$somaPerfil = 0

$diasHomepage = 0
$diasPortal = 0
$diasPerfil = 0

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
# PROCESSA CADA EXECUÇÃO DA SEMANA
# ============================================================

foreach ($itemArquivo in $arquivos) {

    $json = $itemArquivo.Json

    if ($null -eq $primeiroDia) {
        $primeiroDia = $json
    }

    $ultimoDia = $json

    # ========================================================
    # COLETA FALHAS DETALHADAS
    # ========================================================

    if ($json.topFalhas) {

        $falhasDoDia = @()

        # Compatibilidade com formato antigo
        if ($null -ne $json.topFalhas.value) {

            $falhasDoDia =
                @($json.topFalhas.value)

        }
        else {

            $falhasDoDia =
                @($json.topFalhas)

        }

        foreach ($falhaItem in $falhasDoDia) {

            if ($null -eq $falhaItem) {
                continue
            }

            $suiteValida =
                -not [string]::IsNullOrWhiteSpace(
                    [string]$falhaItem.suite
                )

            $cenarioValido =
                -not [string]::IsNullOrWhiteSpace(
                    [string]$falhaItem.cenario
                )

            if ($suiteValida -and $cenarioValido) {

                $todasFalhas += [PSCustomObject]@{
                    suite = [string]$falhaItem.suite
                    cenario = [string]$falhaItem.cenario
                    erro = [string]$falhaItem.erro
                }

            }

        }

    }

    # ========================================================
    # HISTÓRICO DA SEMANA
    # ========================================================

    $historico += @{
        data = $json.data
        hora = $json.hora
        total = [int]$json.total
        passed = [int]$json.passed
        failed = [int]$json.failed
        successRate = [double]$json.successRate
    }

    # ========================================================
    # RESUMO
    # ========================================================

    $dias++

    $total += [int]$json.total
    $aprovados += [int]$json.passed
    $falhas += [int]$json.failed
    $somaSucesso += [double]$json.successRate

    # ============================================================
# COLETA DISPONIBILIDADE POR MÓDULO
# ============================================================

if ($null -ne $json.homepage) {
    $somaHomepage += [double]$json.homepage
    $diasHomepage++
}

if ($null -ne $json.portal) {
    $somaPortal += [double]$json.portal
    $diasPortal++
}

if ($null -ne $json.perfil) {
    $somaPerfil += [double]$json.perfil
    $diasPerfil++
}

    # ========================================================
    # DIAS COM FALHA / SEQUÊNCIA SEM FALHAS
    # ========================================================

    if ([int]$json.failed -gt 0) {

        $diasComFalha++
        $sequenciaAtualSemFalhas = 0

    }
    else {

        $execucaoPerfeita = $true

        $sequenciaAtualSemFalhas++

        if (
            $sequenciaAtualSemFalhas -gt
            $maiorSequenciaSemFalhas
        ) {

            $maiorSequenciaSemFalhas =
                $sequenciaAtualSemFalhas

        }

    }

    # ========================================================
    # PIOR DIA
    # ========================================================

    if (
        $null -eq $piorDia -or
        [double]$json.successRate -lt
        [double]$piorDia.successRate
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
# CALCULA SAÚDE DOS MÓDULOS
# ============================================================

$mediaHomepage = if ($diasHomepage -gt 0) {
    [math]::Round($somaHomepage / $diasHomepage, 2)
}
else {
    0
}

$mediaPortal = if ($diasPortal -gt 0) {
    [math]::Round($somaPortal / $diasPortal, 2)
}
else {
    0
}

$mediaPerfil = if ($diasPerfil -gt 0) {
    [math]::Round($somaPerfil / $diasPerfil, 2)
}
else {
    0
}

function Get-StatusModulo {

    param(
        [double]$Disponibilidade
    )

    if ($Disponibilidade -eq 100) {
        return "ESTAVEL"
    }
    elseif ($Disponibilidade -ge 95) {
        return "ATENCAO"
    }
    else {
        return "CRITICO"
    }
}

$saudeModulos = @(
    @{
        nome = "HomePage"
        disponibilidade = $mediaHomepage
        status = Get-StatusModulo $mediaHomepage
    },
    @{
        nome = "Portal Camed"
        disponibilidade = $mediaPortal
        status = Get-StatusModulo $mediaPortal
    },
    @{
        nome = "Perfil Associado"
        disponibilidade = $mediaPerfil
        status = Get-StatusModulo $mediaPerfil
    }
)

# ============================================================
# TENDÊNCIA
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
# RANKING DE FALHAS
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
# MÓDULO MAIS INSTÁVEL
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
# OBJETO FINAL DO DASHBOARD SEMANAL
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

    saudeModulos = $saudeModulos

    insights = @{

        falhaMaisRecorrente =
            $falhaMaisRecorrente

        moduloMaisInstavel =
            $moduloMaisInstavel

        maiorSequenciaSemFalhas =
            $maiorSequenciaSemFalhas

        execucaoPerfeita =
            $execucaoPerfeita

    }

}

# ============================================================
# SALVA DASHBOARD SEMANAL
# ============================================================

$jsonDashboard = $dashboard |
    ConvertTo-Json -Depth 10

[System.IO.File]::WriteAllText(
    "historico/dashboard.json",
    $jsonDashboard,
    [System.Text.UTF8Encoding]::new($false)
)

# ============================================================
# RESUMO NO TERMINAL
# ============================================================

Write-Host ""
Write-Host "==============================="
Write-Host "DASHBOARD GERADO COM SUCESSO"
Write-Host "==============================="

Write-Host ""
Write-Host "Dashboard semanal:"
Write-Host "historico/dashboard.json"

Write-Host ""
Write-Host "Historico completo:"
Write-Host "historico/historico-completo.json"

Write-Host ""
Write-Host "Periodo             : $($inicioPeriodo.ToString('dd/MM/yyyy')) a $($fimPeriodo.ToString('dd/MM/yyyy'))"
Write-Host "Dias analisados     : $dias"
Write-Host "Total de cenarios   : $total"
Write-Host "Dias com falha      : $diasComFalha"
Write-Host "Falhas semanais     : $falhas"
Write-Host "Taxa media          : $mediaSucesso%"
Write-Host "Pior dia            : $($piorDia.data) - $($piorDia.successRate)%"
Write-Host "Sequencia sem falha : $maiorSequenciaSemFalhas dia(s)"
Write-Host "Modulo instavel     : $($moduloMaisInstavel.nome)"
Write-Host "Falha recorrente    : $($falhaMaisRecorrente.cenario)"

Write-Host ""