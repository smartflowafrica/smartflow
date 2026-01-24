# Quick Deployment to VPS
# Run these commands on your Windows machine

# 1. Create deployment package (zip without node_modules)
Write-Host "Creating deployment package..." -ForegroundColor Green

# Get all files except excluded directories
$files = Get-ChildItem -Path . -Exclude node_modules,.next,.git,*.log,smartflow-deploy.zip
Compress-Archive -Path $files -DestinationPath smartflow-deploy.zip -Force -CompressionLevel Optimal

# 2. Upload to VPS (replace with your details)
$VPS_IP = "YOUR_VPS_IP"
$VPS_USER = "YOUR_USERNAME"

Write-Host "Upload smartflow-deploy.zip to your VPS using one of these methods:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option A: Using SCP (if you have it installed)"
Write-Host "scp smartflow-deploy.zip ${VPS_USER}@${VPS_IP}:/tmp/"
Write-Host ""
Write-Host "Option B: Using FileZilla/WinSCP"
Write-Host "1. Open FileZilla"
Write-Host "2. Connect to ${VPS_IP}"
Write-Host "3. Upload smartflow-deploy.zip to /tmp/"
Write-Host ""
Write-Host "After upload, run these commands on your VPS:"
Write-Host ""
Write-Host "sudo mkdir -p /var/www/smartflowafrica"
Write-Host 'sudo chown -R $USER:$USER /var/www/smartflowafrica'
Write-Host "cd /var/www/smartflowafrica"
Write-Host "unzip /tmp/smartflow-deploy.zip"
Write-Host "chmod +x deploy.sh"
Write-Host "./deploy.sh"
Write-Host ""
Write-Host "Deployment package created: smartflow-deploy.zip" -ForegroundColor Green
