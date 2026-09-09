#!/bin/bash
set -e

echo "=================================================="
echo "    Génération du build Windows (win32-x64)       "
echo "=================================================="

# Générer l'application et l'installeur Squirrel Windows (.exe)
npx electron-forge make --platform=win32 --arch=x64

echo ""
echo "✅ Build terminé avec succès !"
echo "📁 L'installeur Windows se trouve dans :"
echo "   out/make/squirrel.windows/x64/"
echo "=================================================="
