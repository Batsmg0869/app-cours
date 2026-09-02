#!/bin/bash
set -e

echo "=================================================="
echo "    Génération du build Windows (win32-x64)       "
echo "=================================================="

# On package l'application pour Windows sans créer d'archive ZIP ni d'installeur (qui nécessitent zip/wine/mono)
# Cela va créer le dossier contenant le fichier .exe
npx electron-forge package --platform=win32 --arch=x64

echo ""
echo "✅ Build terminé avec succès !"
echo "📁 Vous trouverez l'exécutable Windows dans le dossier :"
echo "   out/homework-planner-win32-x64/"
echo "=================================================="
