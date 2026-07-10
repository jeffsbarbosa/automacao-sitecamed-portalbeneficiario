Write-Host ""
Write-Host "==============================="
Write-Host "GERANDO DASHBOARD"
Write-Host "==============================="

# Lê todos os arquivos do histórico
$arquivos = Get-ChildItem "historico" -Filter *.json | Sort-Object Name

# Lista que armazenará o histórico
$historico = @()

# Variáveis do resumo
$dias = 0
$total = 0
$aprovados = 0
$falhas = 0
$somaSucesso = 0

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
}

# Calcula média
$mediaSucesso = [math]::Round($somaSucesso / $dias,2)

# Objeto final
$dashboard = @{
    resumo = @{
        dias = $dias
        cenarios = $total
        aprovados = $aprovados
        falhas = $falhas
        sucesso = $mediaSucesso
    }

    historico = $historico
}

# Salva o arquivo
$dashboard |
    ConvertTo-Json -Depth 5 |
    Set-Content "historico/dashboard.json" -Encoding UTF8

Write-Host ""
Write-Host "Dashboard criado com sucesso!"
Write-Host "Arquivo: historico/dashboard.json"