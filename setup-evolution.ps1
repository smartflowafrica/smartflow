# Setup Script for Evolution API
# Run this in PowerShell as Administrator

Write-Host "🚀 Starting Evolution API Setup..." -ForegroundColor Cyan

# 1. Check for Docker
if (!(Get-Command "docker" -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not installed or not in PATH. Please install Docker Desktop first."
    exit 1
}

# 2. Generate Secure API Key
$ApiKey = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
Write-Host "🔑 Generated Secure API Key: $ApiKey" -ForegroundColor Green

# 3. Create .env file for Evolution
$EnvContent = @"
AUTHENTICATION_API_KEY=$ApiKey
SERVER_URL=http://localhost:8081
"@
Set-Content -Path ".env.evolution" -Value $EnvContent

# 4. Update docker-compose.yml with Key (Simple replacement for the placeholder)
$ComposeFile = "docker-compose.yml"
$Content = Get-Content $ComposeFile
$NewContent = $Content -replace "CHANGE_ME_TO_A_SECURE_KEY", $ApiKey
Set-Content -Path $ComposeFile -Value $NewContent

Write-Host "📝 Configuration updated." -ForegroundColor Yellow

# 5. Start Services
Write-Host "🐳 Starting Docker Services..." -ForegroundColor Cyan
docker-compose up -d

if ($?) {
    Write-Host "✅ Evolution API is running!" -ForegroundColor Green
    Write-Host "   - Dashboard/API: http://localhost:8081"
    Write-Host "   - API Key: $ApiKey"
    Write-Host "   - Swagger Docs: http://localhost:8081/docs"
} else {
    Write-Error "Failed to start Docker services. Check docker-compose output."
}
