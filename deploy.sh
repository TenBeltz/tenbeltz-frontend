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

echo "Deployment completed successfully!"

