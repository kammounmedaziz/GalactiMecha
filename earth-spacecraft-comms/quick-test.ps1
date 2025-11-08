# Tests PowerShell pour Windows
# Usage: .\quick-test.ps1

Write-Host "🚀 Test du Système de Communication Terre ↔ Vaisseau" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://localhost:3000"
$EARTH_TOKEN = "earth-token-123"
$SPACECRAFT_TOKEN = "spacecraft-token-456"

# Test 1: Chiffrement
Write-Host "Test 1: Chiffrement d'un message" -ForegroundColor Blue
Write-Host "--------------------------------------"
$body1 = @{
    message = "Houston, nous avons un problème!"
} | ConvertTo-Json

try {
    $response1 = Invoke-RestMethod -Uri "$API_URL/api/encryption/encrypt" `
        -Method POST `
        -Headers @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $EARTH_TOKEN"
        } `
        -Body $body1
    
    Write-Host "✅ Succès:" -ForegroundColor Green
    $response1 | ConvertTo-Json
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
}

Start-Sleep -Seconds 1
Write-Host ""

# Test 2: Envoi de message
Write-Host "Test 2: Envoi de message" -ForegroundColor Blue
Write-Host "--------------------------------------"
$body2 = @{
    from = "Earth"
    to = "Spacecraft"
    message = "Préparez-vous pour l'amarrage"
    priority = "high"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "$API_URL/api/messages/send" `
        -Method POST `
        -Headers @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $EARTH_TOKEN"
        } `
        -Body $body2
    
    Write-Host "✅ Succès:" -ForegroundColor Green
    $response2 | ConvertTo-Json
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
}

Start-Sleep -Seconds 1
Write-Host ""

# Test 3: Réception des messages
Write-Host "Test 3: Réception des messages" -ForegroundColor Blue
Write-Host "--------------------------------------"
try {
    $response3 = Invoke-RestMethod -Uri "$API_URL/api/messages/receive/Spacecraft" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $SPACECRAFT_TOKEN"
        }
    
    Write-Host "✅ Succès:" -ForegroundColor Green
    $response3 | ConvertTo-Json
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
}

Start-Sleep -Seconds 1
Write-Host ""

# Test 4: Envoi de télémétrie
Write-Host "Test 4: Envoi de télémétrie" -ForegroundColor Blue
Write-Host "--------------------------------------"
$body4 = @{
    spacecraft_id = "MARS-001"
    timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    position = @{ x = 150000; y = 200000; z = 50000 }
    velocity = @{ x = 2500; y = 1800; z = 300 }
    fuel_level = 75.5
    temperature = -120
    status = "operational"
} | ConvertTo-Json

try {
    $response4 = Invoke-RestMethod -Uri "$API_URL/api/telemetry" `
        -Method POST `
        -Headers @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $SPACECRAFT_TOKEN"
        } `
        -Body $body4
    
    Write-Host "✅ Succès:" -ForegroundColor Green
    $response4 | ConvertTo-Json
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
}

Start-Sleep -Seconds 1
Write-Host ""

# Test 5: Récupération de télémétrie
Write-Host "Test 5: Récupération de télémétrie" -ForegroundColor Blue
Write-Host "--------------------------------------"
try {
    $response5 = Invoke-RestMethod -Uri "$API_URL/api/telemetry/MARS-001" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $EARTH_TOKEN"
        }
    
    Write-Host "✅ Succès:" -ForegroundColor Green
    $response5 | ConvertTo-Json
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Tous les tests sont terminés!" -ForegroundColor Green
Write-Host ""
