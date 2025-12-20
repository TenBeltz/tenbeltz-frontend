#!/bin/bash

set -e  # Exit on any error

echo "Starting deployment process..."

echo "Pulling latest changes..."
if ! git pull; then
    echo "Error: Git pull failed"
    exit 1
fi

echo "Installing dependencies..."
if ! npm install; then
    echo "Error: npm install failed"
    exit 1
fi

echo "Building project..."
if ! npm run build; then
    echo "Error: Build failed"
    exit 1
fi

echo "Starting frontend server on port 3001 with PM2..."
APP_NAME="tenbeltz-frontend"
export HOST=0.0.0.0
export PORT=3001

if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
    pm2 restart "$APP_NAME"
else
    pm2 start ./dist/server/entry.mjs --name "$APP_NAME"
fi

pm2 save
