#!/bin/bash

set -e  # Exit on any error

echo "Starting deployment process..."

ASTRO_ASSET_DIR="dist/client/_astro"
ASTRO_ASSET_BACKUP="$(mktemp -d)"

cleanup() {
    rm -rf "$ASTRO_ASSET_BACKUP"
}

trap cleanup EXIT

if [ -d "$ASTRO_ASSET_DIR" ]; then
    echo "Backing up existing Astro assets..."
    cp -a "$ASTRO_ASSET_DIR/." "$ASTRO_ASSET_BACKUP/"
fi

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

if [ -d "$ASTRO_ASSET_BACKUP" ] && [ "$(find "$ASTRO_ASSET_BACKUP" -mindepth 1 -maxdepth 1 | wc -l)" -gt 0 ]; then
    echo "Restoring previous Astro assets for cache-safe deploys..."
    mkdir -p "$ASTRO_ASSET_DIR"
    cp -an "$ASTRO_ASSET_BACKUP/." "$ASTRO_ASSET_DIR/"
fi

echo "Starting frontend server on port 3001 with PM2..."
APP_NAME="tenbeltz-frontend"
export HOST=0.0.0.0
export PORT=3001

if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
    pm2 restart "$APP_NAME" --update-env
else
    pm2 start ./dist/server/entry.mjs --name "$APP_NAME"
fi

pm2 save
