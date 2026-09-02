# Maintainer: Batsmg0869
pkgname=homework-planner
pkgver=2.2.2
pkgrel=1
pkgdesc="Application de gestion de devoirs pour les étudiants"
arch=('x86_64')
url="https://github.com/Batsmg0869/HomeworkPlanner"
license=('MIT')
depends=('gtk3' 'nss' 'alsa-lib' 'libxss')
makedepends=('nodejs' 'npm')
source=()

build() {
  cd "$srcdir/.."
  npm install
  npx electron-forge package
}

package() {
  cd "$srcdir/.."
  install -dm755 "$pkgdir/usr/lib/$pkgname"
  cp -r "out/$pkgname-linux-x64"/* "$pkgdir/usr/lib/$pkgname/"

  install -dm755 "$pkgdir/usr/bin"
  cat << 'EOF' > "$pkgdir/usr/bin/$pkgname"
#!/bin/bash
exec /usr/lib/homework-planner/homework-planner "$@"
EOF
  chmod 755 "$pkgdir/usr/bin/$pkgname"

  install -dm755 "$pkgdir/usr/share/applications"
  cat << EOF > "$pkgdir/usr/share/applications/$pkgname.desktop"
[Desktop Entry]
Name=HomeworkPlanner
Comment=Application de gestion de devoirs pour les étudiants
Exec=/usr/bin/$pkgname %U
Terminal=false
Type=Application
Icon=$pkgname
Categories=Office;Education;Utility;
StartupWMClass=homework-planner
EOF

  install -Dm644 "favicon.png" "$pkgdir/usr/share/icons/hicolor/256x256/apps/$pkgname.png"
}
