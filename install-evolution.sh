#!/bin/bash
echo "🚀 Starting Evolution API Installation..."

# 1. Install Docker & Docker Compose
echo "🐳 Installing Docker..."
# Update apt
apt-get update
# Install prerequisites
apt-get install -y ca-certificates curl gnupg
# Add Docker GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
# Add Repo
echo \
  "deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null
# Install
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 2. Create Docker Compose File
echo "📝 Creating Configuration..."
mkdir -p /home/evolution-api
cd /home/evolution-api

cat <<EOT > docker-compose.yml
version: '3.3'
services:
  evolution-api:
    container_name: evolution_api
    image: attosol/evolution-api:v1.8.2
    restart: always
    ports:
      - "8081:8080"
    environment:
      - SERVER_URL=https://smartflowafrica.com/api/evolution
      - DOCKER_ENV=true
      - LOG_LEVEL=ERROR
      - DEL_INSTANCE=false
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://postgres.cmjww0im80000mxoqnle0jsiw:H7x9p2M5kL8n4Q@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
      - DATABASE_CLIENT_NAME=evolution_v1
      - AUTHENTICATION_API_KEY=44289315-9C0C-4318-825B-60C7E9A34567
      - CACHE_REDIS_ENABLED=true
      - CACHE_REDIS_URI=redis://redis:6379/0
    depends_on:
      - redis

  redis:
    image: redis:alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  redis_data:
EOT

# 3. Start Services
echo "🟢 Starting Evolution API..."
docker compose up -d

# 4. Show Status
echo "✅ Installation Complete!"
docker ps
