#!/bin/bash

# SmartFlow Africa - VPS Deployment Script
# Run this script on your VPS after uploading the project files

set -e  # Exit on any error

echo "🚀 Starting SmartFlow Africa Deployment..."

# Configuration
APP_NAME="smartflow"
APP_DIR="/var/www/smartflowafrica"
DOMAIN="smartflowafrica.com"
NODE_VERSION="18"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run as root. Run as your regular user with sudo privileges."
    exit 1
fi

# 1. Update System
echo ""
echo "📦 Step 1: Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_status "System updated"

# 2. Install Node.js
echo ""
echo "📦 Step 2: Installing Node.js ${NODE_VERSION}..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
    print_status "Node.js installed: $(node -v)"
else
    print_status "Node.js already installed: $(node -v)"
fi

# 3. Install PM2
echo ""
echo "📦 Step 3: Installing PM2 process manager..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    print_status "PM2 installed"
else
    print_status "PM2 already installed"
fi

# 4. Install Nginx
echo ""
echo "📦 Step 4: Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt install nginx -y
    sudo systemctl enable nginx
    print_status "Nginx installed"
else
    print_status "Nginx already installed"
fi

# 5. Create application directory
echo ""
echo "📁 Step 5: Setting up application directory..."
if [ ! -d "$APP_DIR" ]; then
    sudo mkdir -p $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR
    print_status "Application directory created: $APP_DIR"
else
    print_status "Application directory exists: $APP_DIR"
fi

# 6. Install dependencies and build
echo ""
echo "📦 Step 6: Installing dependencies..."
cd $APP_DIR
npm install
print_status "Dependencies installed"

echo ""
echo "🔨 Step 7: Building production bundle..."
npm run build
print_status "Production build completed"

# 7. Configure PM2
echo ""
echo "⚙️  Step 8: Configuring PM2..."
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start npm --name "$APP_NAME" -- start
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
print_status "PM2 configured and application started"

# 8. Configure Nginx
echo ""
echo "⚙️  Step 9: Configuring Nginx..."
sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t
sudo systemctl restart nginx
print_status "Nginx configured and restarted"

# 9. Configure Firewall
echo ""
echo "🔒 Step 10: Configuring firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    print_status "Firewall configured"
else
    print_warning "UFW not installed, skipping firewall configuration"
fi

# 10. SSL Setup
echo ""
echo "🔒 Step 11: Setting up SSL certificate..."
if command -v certbot &> /dev/null; then
    print_warning "Certbot already installed"
else
    sudo apt install certbot python3-certbot-nginx -y
    print_status "Certbot installed"
fi

echo ""
print_warning "To enable HTTPS, run this command manually after DNS is pointed to your VPS:"
echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos -m hello@$DOMAIN"

# 11. Summary
echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ Deployment Complete!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📊 Status:"
pm2 status
echo ""
echo "🌐 Your application is running at:"
echo "   → http://$(curl -s ifconfig.me)"
echo ""
echo "📋 Next Steps:"
echo "   1. Point your domain DNS to this server IP: $(curl -s ifconfig.me)"
echo "      A Record: @ → $(curl -s ifconfig.me)"
echo "      A Record: www → $(curl -s ifconfig.me)"
echo ""
echo "   2. After DNS propagates (5-30 minutes), run SSL command:"
echo "      sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "   3. Upload your OG image to: $APP_DIR/public/og-image.jpg"
echo ""
echo "📝 Useful Commands:"
echo "   View logs:        pm2 logs $APP_NAME"
echo "   Restart app:      pm2 restart $APP_NAME"
echo "   Stop app:         pm2 stop $APP_NAME"
echo "   Nginx status:     sudo systemctl status nginx"
echo "   Reload Nginx:     sudo systemctl reload nginx"
echo ""
echo "🎉 SmartFlow Africa is now live!"
echo "════════════════════════════════════════════════════════"
