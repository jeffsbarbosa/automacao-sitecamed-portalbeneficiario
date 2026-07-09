Write-Host ""
Write-Host "==============================="
Write-Host "GERANDO DASHBOARD"
Write-Host "==============================="

# Lê todos os arquivos do histórico
$arquivos = Get-ChildItem "historico" -Filter *.json | Sort-Object Name

# Lista que armazenará o histórico
$historico = @()

foreach ($arquivo in $arquivos) {

    $json = Get-Content $arquivo.FullName -Raw | ConvertFrom-Json

    $historico += @{
        data = $json.data
        total = $json.total
        passed = $json.passed
        failed = $json.failed
        successRate = $json.successRate
    }
}

# Objeto final
$dashboard = @{
    historico = $historico
}

# Salva o arquivo
$dashboard |
    ConvertTo-Json -Depth 5 |
    Set-Content "historico/dashboard.json" -Encoding UTF8

Write-Host ""
Write-Host "Dashboard criado com sucesso!"
Write-Host "Arquivo: historico/dashboard.json"