#!/bin/bash

set -e

echo "🚀 Deploying (serving from dist)..."

cd /home/webuser/web/demo1.automate.com.bd/public_html

echo "📥 Pull latest code..."
git fetch --all
git reset --hard origin/main

echo "📦 Install dependencies..."
npm install

echo "🏗 Build project..."
npm run build

echo "🔐 Set permissions..."
chmod -R 755 dist

echo "✅ Deployment complete (serving from dist)"