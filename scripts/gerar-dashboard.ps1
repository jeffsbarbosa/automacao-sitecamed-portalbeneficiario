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
$somaSucesso = 0

# Melhor e pior execução
$melhorDia = $null
$piorDia = $null

foreach ($arquivo in $arquivos) {

    $json = Get-Content $arquivo.FullName -Raw | ConvertFrom-Json

    # Adiciona ao histórico
    $historico += @{
        data = $json.data
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
    $somaSucesso += [double]$json.successRate

    # Identifica o melhor dia
    if ($null -eq $melhorDia -or [double]$json.successRate -gt [double]$melhorDia.successRate) {
        $melhorDia = $json
    }

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
if ($null -eq $melhorDia) {
    $melhorDia = @{
        data = "-"
        successRate = 0
    }
}

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
        sucesso = $mediaSucesso

        melhorDia = @{
            data = $melhorDia.data
            sucesso = $melhorDia.successRate
        }

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
Write-Host "Taxa média      : $mediaSucesso%"
Write-Host "Melhor dia      : $($melhorDia.data) - $($melhorDia.successRate)%"
Write-Host "Pior dia        : $($piorDia.data) - $($piorDia.successRate)%"
Write-Host ""