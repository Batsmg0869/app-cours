# Guide des Commandes Electron

Ce fichier récapitule les commandes essentielles pour développer et compiler l'application.

> [!IMPORTANT]
> **Avant de lancer une commande**, assurez-vous d'être positionné dans le dossier du projet dans votre terminal :
> ```bash
> cd "/home/batsmg0869/Documents/App cours/mon-app-cours"
> ```

---

## 1. Installation des dépendances
À exécuter lors de la première installation du projet, ou si de nouvelles dépendances ont été ajoutées dans le fichier `package.json`.
```bash
npm install
```

## 2. Lancer l'application en développement (Test)
Pour démarrer et tester l'application localement.

**Méthode par défaut (Electron Forge) :**
```bash
npm start
```

**Méthode directe (si Electron Forge pose problème) :**
```bash
npx electron .
```

## 3. Compiler et générer les builds sur Linux (Arch Linux / CachyOS & autres)

### Pour Arch Linux & CachyOS (Recommandé) : Paquet natif Pacman + Archives
Génère le paquet `.pkg.tar.zst` prêt pour `pacman`, ainsi que les archives `.tar.gz` et `.zip` :
```bash
npm run build:arch
```
*(ou `bash build-arch.sh`)*

### 📂 Où trouver les fichiers générés pour Arch / CachyOS ?
Les paquets sont créés dans :
`out/make/arch/`

| Fichier | Format | Utilisation |
|---------|--------|-------------|
| `homework-planner-2.2.2-1-x86_64.pkg.tar.zst` | **Paquet Pacman natif** | Installation directe système avec icône et raccourci |
| `homework-planner-2.2.2-linux-x86_64.tar.gz` | Archive Tarball | Version portable sans installation |
| `homework-planner-2.2.2-linux-x86_64.zip` | Archive Zip | Version portable |
| `out/homework-planner-linux-x64/` | Dossier binaire | Lancement direct sans archive |

### 🚀 Installer le paquet sur Arch Linux / CachyOS
```bash
sudo pacman -U out/make/arch/homework-planner-2.2.2-1-x86_64.pkg.tar.zst
```

### Pour désinstaller :
```bash
sudo pacman -R homework-planner
```

---

### Pour Debian / Ubuntu / Fedora (Deb & Rpm)
Si vous disposez de `dpkg` et `rpm-build` installés :
```bash
npm run make
```
Les paquets seront dans `out/make/deb/x64/` et `out/make/rpm/x64/`.

