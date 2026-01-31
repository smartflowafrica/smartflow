#!/bin/bash

# Production Debug Script for SmartFlow Africa
# Upload this to your VPS and run it: chmod +x debug-prod.sh && ./debug-prod.sh

echo "========================================================"
echo "🕵️ SmartFlow Production Debugger"
echo "========================================================"

# 1. Check Docker
echo ""
echo "---------- 1. Docker Status ----------"
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed."
    
    if sudo docker ps | grep -q "evolution_api"; then
        echo "✅ Evolution API container is RUNNING."
    else
        echo "❌ Evolution API container is NOT running."
        echo "   Running containers:"
        sudo docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    fi
else
    echo "❌ Docker is NOT installed."
fi

# 2. Check Evolution API Config (from Docker)
echo ""
echo "---------- 2. Evolution API Configuration ----------"
if sudo docker ps | grep -q "evolution_api"; then
    EVO_KEY=$(sudo docker inspect evolution_api --format '{{range .Config.Env}}{{ifWithPrefix . "AUTHENTICATION_API_KEY="}}{{.}}{{end}}{{end}}' | cut -d= -f2)
    echo "🔑 Key in Docker Container: $EVO_KEY"
    
    echo "Checking connectivity..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/instance/fetchInstances -H "apikey: $EVO_KEY")
    if [ "$HTTP_CODE" == "200" ]; then
        echo "✅ Connection to Evolution API (http://localhost:8081) from Shell: SUCCESS (200 OK)"
    else
        echo "❌ Connection to Evolution API failed. Status: $HTTP_CODE"
    fi
else
    echo "Skipping config check (Container not running)."
fi

# 3. Check Next.js Configuration
echo ""
echo "---------- 3. Next.js Configuration ----------"
ENV_FILE="/var/www/smartflowafrica/.env.production"
if [ -f "$ENV_FILE" ]; then
    echo "✅ Found .env.production at $ENV_FILE"
    NEXT_KEY=$(grep "AUTHENTICATION_API_KEY" $ENV_FILE | cut -d= -f2 | tr -d '"' | tr -d "'")
    SERVER_URL=$(grep "SERVER_URL" $ENV_FILE | cut -d= -f2 | tr -d '"' | tr -d "'")
    
    echo "🔑 Key in .env.production:  $NEXT_KEY"
    echo "🌐 SERVER_URL in .env:      $SERVER_URL"
    
    # Compare Keys
    if [ ! -z "$EVO_KEY" ]; then
        if [ "$NEXT_KEY" == "$EVO_KEY" ]; then
            echo "✅ KEYS MATCH! Authentication should work."
        else
            echo "❌ KEY MISMATCH! The Next.js app is using a different key than Evolution API."
            echo "   Fix: Update AUTHENTICATION_API_KEY in $ENV_FILE to Match Docker Key."
        fi
    fi
else
    echo "❌ .env.production file NOT found at $ENV_FILE"
fi

echo ""
echo "========================================================"
