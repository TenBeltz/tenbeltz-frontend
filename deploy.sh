#!/bin/bash

# Ejecutar los comandos y capturar toda la salida
output=$(git pull 2>&1
npm install 2>&1
npm run build 2>&1)

# Verificar si la salida contiene "Complete!"
if echo "$output" | grep -q "Complete!"; then
    echo "Deploy Exitoso"
fi

