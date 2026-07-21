Write-Host ""
Write-Host "==============================="
Write-Host "GERANDO DASHBOARD"
Write-Host "==============================="

# Lê apenas os arquivos dos últimos 7 dias
$limite = (Get-Date).AddDays(-7)

$arquivos = Get-ChildItem "historico" -Filter *.json |
    Where-Object {
        $_.Name -ne "dashboard.json" -and
        $_.LastWriteTime -ge $limite
    } |
    Sort-Object Name

# Lista que armazenará o histórico
$historico = @()

# Variáveis do resumo
$dias = 0
$total = 0
$aprovados = 0
$falhas = 0
$diasComFalha = 0
$somaSucesso = 0

# Pior execução da semana
$piorDia = $null

foreach ($arquivo in $arquivos) {

    $json = Get-Content $arquivo.FullName -Raw | ConvertFrom-Json

    # Adiciona ao histórico
    $historico += @{
        data = $json.data
        hora = $json.hora
        total = $json.total
        passed = $json.passed
        failed = $json.failed
        successRate = $json.successRate
    }

    # Alimenta o resumo
    $dias++
    $total += [int]$json.total
    $aprovados += [int]$json.passed
    $falhas += [int]$json.failed

    if ([int]$json.failed -gt 0) {
        $diasComFalha++
    }

    $somaSucesso += [double]$json.successRate

    # Identifica o pior dia
    if ($null -eq $piorDia -or [double]$json.successRate -lt [double]$piorDia.successRate) {
        $piorDia = $json
    }
}

# Calcula média de sucesso
if ($dias -eq 0) {
    $mediaSucesso = 0
}
else {
    $mediaSucesso = [math]::Round($somaSucesso / $dias, 2)
}

# Proteção caso não exista histórico
if ($null -eq $piorDia) {
    $piorDia = @{
        data = "-"
        successRate = 0
    }
}

# Objeto final do dashboard
$dashboard = @{
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
    }

    historico = $historico
}

# Salva o dashboard
$dashboard |
    ConvertTo-Json -Depth 5 |
    Set-Content "historico/dashboard.json" -Encoding UTF8

Write-Host ""
Write-Host "==============================="
Write-Host "DASHBOARD GERADO COM SUCESSO"
Write-Host "==============================="
Write-Host "Arquivo: historico/dashboard.json"
Write-Host "Dias analisados : $dias"
Write-Host "Total cenários  : $total"
Write-Host "Dias com falha  : $diasComFalha"
Write-Host "Falhas semanais : $falhas"
Write-Host "Taxa média      : $mediaSucesso%"
Write-Host "Pior dia        : $($piorDia.data) - $($piorDia.successRate)%"
Write-Host ""