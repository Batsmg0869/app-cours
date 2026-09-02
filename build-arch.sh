#!/bin/bash
set -e

# Se placer dans le dossier du projet
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# S'assurer que Node/NPM sont dans le PATH
export PATH="$HOME/.local/share/fnm/current/bin:$HOME/.local/share/fnm/node-versions/v24.20.0/installation/bin:$PATH"

PKG_NAME="homework-planner"
PKG_VER="2.2.2"
PKG_REL="1"
ELECTRON_ARCH="x64"
PACMAN_ARCH="x86_64"
DIST_DIR="$SCRIPT_DIR/out"
ARCH_OUT_DIR="$DIST_DIR/make/arch"
PKG_DIR="$ARCH_OUT_DIR/pkg"

echo "=================================================="
echo "  Build pour Arch Linux / CachyOS ($PKG_NAME v$PKG_VER)"
echo "=================================================="

# 1. Empaquetage Electron
echo "📦 Étape 1/3 : Compilation et empaquetage Electron..."
npx electron-forge package

APP_DIR="$DIST_DIR/$PKG_NAME-linux-$ELECTRON_ARCH"
if [ ! -d "$APP_DIR" ]; then
    echo "❌ Erreur : Dossier $APP_DIR introuvable !"
    exit 1
fi

# Nettoyer le dossier de sortie Arch
rm -rf "$ARCH_OUT_DIR"
mkdir -p "$PKG_DIR/usr/lib/$PKG_NAME"
mkdir -p "$PKG_DIR/usr/bin"
mkdir -p "$PKG_DIR/usr/share/applications"
mkdir -p "$PKG_DIR/usr/share/icons/hicolor/256x256/apps"

# 2. Création de la structure du paquet Arch
echo "📁 Étape 2/3 : Préparation de l'arborescence du paquet Arch..."

# Copier les fichiers de l'application
cp -r "$APP_DIR"/* "$PKG_DIR/usr/lib/$PKG_NAME/"

# Copier l'icône
cp "$SCRIPT_DIR/favicon.png" "$PKG_DIR/usr/share/icons/hicolor/256x256/apps/$PKG_NAME.png"

# Créer le lanceur dans /usr/bin
cat << 'EOF' > "$PKG_DIR/usr/bin/$PKG_NAME"
#!/bin/bash
exec /usr/lib/homework-planner/homework-planner "$@"
EOF
chmod +x "$PKG_DIR/usr/bin/$PKG_NAME"

# Créer le fichier .desktop
cat << EOF > "$PKG_DIR/usr/share/applications/$PKG_NAME.desktop"
[Desktop Entry]
Name=HomeworkPlanner
Comment=Application de gestion de devoirs pour les étudiants
Exec=/usr/bin/$PKG_NAME %U
Terminal=false
Type=Application
Icon=$PKG_NAME
Categories=Office;Education;Utility;
StartupWMClass=homework-planner
EOF

# Calculer la taille installée en octets
SIZE=$(du -sk "$PKG_DIR" | cut -f1)
BUILD_DATE=$(date -u +%s)

# Générer .PKGINFO pour Pacman
cat << EOF > "$PKG_DIR/.PKGINFO"
pkgname = $PKG_NAME
pkgver = $PKG_VER-$PKG_REL
pkgdesc = Application de gestion de devoirs pour les étudiants
url = https://github.com/Batsmg0869/HomeworkPlanner
builddate = $BUILD_DATE
packager = Batsmg0869
size = $((SIZE * 1024))
arch = $PACMAN_ARCH
license = MIT
depend = gtk3
depend = nss
depend = alsa-lib
depend = libxss
EOF

# 3. Compression du paquet pacman (.pkg.tar.zst) et des archives
echo "🗜️  Étape 3/3 : Création du paquet pacman (.pkg.tar.zst) et des archives..."

PKG_FILE="$ARCH_OUT_DIR/$PKG_NAME-$PKG_VER-$PKG_REL-$PACMAN_ARCH.pkg.tar.zst"
cd "$PKG_DIR"
tar --owner=0 --group=0 --numeric-owner -cf - .PKGINFO usr | zstd -c -T0 -19 > "$PKG_FILE"

# Créer également une archive tar.gz et .zip pour une utilisation portable
cd "$DIST_DIR"
tar -czf "$ARCH_OUT_DIR/$PKG_NAME-$PKG_VER-linux-$PACMAN_ARCH.tar.gz" "$PKG_NAME-linux-$ELECTRON_ARCH"
if command -v 7z >/dev/null 2>&1; then
    7z a "$ARCH_OUT_DIR/$PKG_NAME-$PKG_VER-linux-$PACMAN_ARCH.zip" "$PKG_NAME-linux-$ELECTRON_ARCH" >/dev/null
fi

# Nettoyage du dossier temporaire
rm -rf "$PKG_DIR"

echo "=================================================="
echo "✅ Build terminé avec succès pour Arch / CachyOS !"
echo "=================================================="
echo "📄 Paquet Pacman : $PKG_FILE"
echo "📦 Archive Tar :   $ARCH_OUT_DIR/$PKG_NAME-$PKG_VER-linux-$PACMAN_ARCH.tar.gz"
if [ -f "$ARCH_OUT_DIR/$PKG_NAME-$PKG_VER-linux-$PACMAN_ARCH.zip" ]; then
    echo "📦 Archive Zip :   $ARCH_OUT_DIR/$PKG_NAME-$PKG_VER-linux-$PACMAN_ARCH.zip"
fi
echo ""
echo "🚀 Pour installer sur Arch / CachyOS :"
echo "   sudo pacman -U \"$PKG_FILE\""
echo "=================================================="
