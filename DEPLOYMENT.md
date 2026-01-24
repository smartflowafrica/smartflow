# SmartFlow Africa - VPS Deployment Guide

## Prerequisites

- Ubuntu/Debian VPS (20.04 or later recommended)
- Root or sudo access
- Domain name pointed to VPS IP
- Minimum 2GB RAM, 2 CPU cores

## Quick Deployment (Automated)

### Step 1: Upload Files to VPS

**Option A: Using Git (Recommended)**
```bash
# On your local machine (Windows PowerShell)
cd c:\wamp64\www\SmartFlowAfricaNew
git init
git add .
git commit -m "Initial deployment"
git remote add origin YOUR_GIT_REPO_URL
git push -u origin main

# On your VPS
git clone YOUR_GIT_REPO_URL /var/www/smartflowafrica
```

**Option B: Using SCP/FileZilla**
1. Open FileZilla or WinSCP
2. Connect to your VPS
3. Upload entire project to `/var/www/smartflowafrica`

### Step 2: Run Deployment Script

```bash
# SSH into your VPS
ssh username@your-vps-ip

# Navigate to project directory
cd /var/www/smartflowafrica

# Make script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

The script will automatically:
- ✅ Install Node.js 18
- ✅ Install PM2 process manager
- ✅ Install and configure Nginx
- ✅ Install dependencies
- ✅ Build production bundle
- ✅ Start application with PM2
- ✅ Configure firewall
- ✅ Setup Nginx reverse proxy

## Manual Deployment (Step by Step)

If you prefer manual control, follow these steps:

### 1. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v  # Verify installation
```

### 2. Install PM2
```bash
sudo npm install -g pm2
pm2 -v  # Verify installation
```

### 3. Install Nginx
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 4. Setup Application
```bash
cd /var/www/smartflowafrica
npm install
npm run build
```

### 5. Start with PM2
```bash
pm2 start npm --name "smartflow" -- start
pm2 save
pm2 startup
```

### 6. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/smartflow
```

Paste the Nginx configuration (see deploy.sh for full config), then:

```bash
sudo ln -s /etc/nginx/sites-available/smartflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. Setup SSL
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d smartflowafrica.com -d www.smartflowafrica.com
```

## Post-Deployment

### Update Application

When you make changes:

```bash
cd /var/www/smartflowafrica
git pull origin main  # If using git
npm install  # If dependencies changed
npm run build
pm2 restart smartflow
```

### Monitor Application

```bash
# View logs
pm2 logs smartflow

# Check status
pm2 status

# Monitor resources
pm2 monit

# Restart app
pm2 restart smartflow

# Stop app
pm2 stop smartflow
```

### Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload (graceful restart)
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## DNS Configuration

Point your domain to your VPS:

1. Login to your domain registrar (Namecheap, GoDaddy, etc.)
2. Go to DNS settings
3. Add these records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_VPS_IP | 300 |
| A | www | YOUR_VPS_IP | 300 |

Wait 5-30 minutes for DNS propagation.

## SSL Certificate (HTTPS)

After DNS propagation:

```bash
sudo certbot --nginx -d smartflowafrica.com -d www.smartflowafrica.com
```

Follow prompts:
- Enter email: hello@smartflowafrica.com
- Agree to terms: Yes
- Redirect HTTP to HTTPS: Yes (recommended)

Auto-renewal is configured automatically.

## Environment Variables (If Needed)

If you need environment variables:

```bash
# Create .env.production file
nano /var/www/smartflowafrica/.env.production
```

Add your variables:
```
NEXT_PUBLIC_API_URL=https://api.smartflowafrica.com
DATABASE_URL=your-database-url
```

Restart app:
```bash
pm2 restart smartflow
```

## Performance Optimization

### Enable Nginx Caching

Already configured in deploy.sh, but you can add more:

```nginx
# Add to Nginx config
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;
proxy_cache my_cache;
```

### PM2 Cluster Mode

For better performance, use cluster mode:

```bash
pm2 delete smartflow
pm2 start npm --name "smartflow" -i max -- start
pm2 save
```

## Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs smartflow

# Rebuild
cd /var/www/smartflowafrica
npm run build
pm2 restart smartflow
```

### Nginx errors
```bash
# Check configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

### Port 3000 already in use
```bash
# Find process
sudo lsof -i :3000

# Kill process
sudo kill -9 PID
```

### SSL certificate issues
```bash
# Renew manually
sudo certbot renew

# Check certificate
sudo certbot certificates
```

## Security Checklist

- ✅ Firewall enabled (ports 22, 80, 443)
- ✅ SSH key authentication (disable password login)
- ✅ Regular updates: `sudo apt update && sudo apt upgrade`
- ✅ SSL certificate installed
- ✅ Security headers configured in Nginx
- ⚠️ Setup fail2ban: `sudo apt install fail2ban -y`
- ⚠️ Regular backups of application and database

## Backup Strategy

```bash
# Create backup script
nano /home/username/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/home/username/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/smartflow_$DATE.tar.gz /var/www/smartflowafrica
```

Setup cron job:
```bash
crontab -e
# Add: 0 2 * * * /home/username/backup.sh
```

## Support

For issues:
1. Check logs: `pm2 logs smartflow`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify DNS: `nslookup smartflowafrica.com`
4. Test SSL: https://www.ssllabs.com/ssltest/

---

**Deployment Script**: `deploy.sh`  
**Last Updated**: October 30, 2025
