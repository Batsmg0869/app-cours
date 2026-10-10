const { app, BrowserWindow, ipcMain, Notification, Tray, Menu, shell, dialog, autoUpdater } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const ics = require('ics');
const https = require('https');

function compareVersions(v1, v2) {
    const p1 = (v1 || '').replace(/^v\.?/, '').split('.').map(n => parseInt(n) || 0);
    const p2 = (v2 || '').replace(/^v\.?/, '').split('.').map(n => parseInt(n) || 0);
    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
        const num1 = p1[i] || 0;
        const num2 = p2[i] || 0;
        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
    }
    return 0;
}

function checkGitHubLatestRelease() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: '/repos/Batsmg0869/app-cours/releases/latest',
            headers: {
                'User-Agent': 'HomeworkPlanner-App'
            }
        };
        https.get(options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error('Format de réponse GitHub invalide'));
                    }
                } else if (res.statusCode === 404) {
                    resolve(null);
                } else {
                    reject(new Error(`Réponse GitHub HTTP ${res.statusCode}`));
                }
            });
        }).on('error', err => reject(err));
    });
}

function setupUpdater(winTarget) {
    if (!app.isPackaged || process.platform === 'linux') return;

    const server = 'https://update.electronjs.org';
    const feed = `${server}/Batsmg0869/app-cours/${process.platform}-${process.arch}/${app.getVersion()}`;

    try {
        autoUpdater.setFeedURL({ url: feed });
    } catch (e) {
        console.error('Erreur setFeedURL:', e);
    }

    autoUpdater.removeAllListeners();

    autoUpdater.on('checking-for-update', () => {
        if (winTarget && !winTarget.isDestroyed()) {
            winTarget.webContents.send('update-status', 'Recherche de mise à jour en cours...');
        }
    });

    autoUpdater.on('update-available', () => {
        if (winTarget && !winTarget.isDestroyed()) {
            winTarget.webContents.send('update-status', 'Mise à jour trouvée. Téléchargement en cours...');
        }
    });

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        if (winTarget && !winTarget.isDestroyed()) {
            winTarget.webContents.send('update-downloaded', releaseName || 'Nouvelle version');
        }
        sendSmartNotification(
            '🚀 Mise à jour prête !',
            `La version ${releaseName || ''} a été téléchargée. Cliquez pour redémarrer et l'installer.`
        );
    });

    autoUpdater.on('error', (err) => {
        const errMsg = err && err.message ? err.message : String(err);
        if (winTarget && !winTarget.isDestroyed()) {
            winTarget.webContents.send('update-status', `Erreur lors de la recherche : ${errMsg}`);
        }
        console.error('Erreur mise à jour:', err);
    });

    autoUpdater.on('update-not-available', () => {
        if (winTarget && !winTarget.isDestroyed()) {
            winTarget.webContents.send('update-status', `Vous êtes déjà sur la dernière version (v${app.getVersion()}).`);
        }
    });
}

ipcMain.on('check-for-updates', async () => {
    if (!win || win.isDestroyed()) return;
    win.webContents.send('update-status', 'Recherche de mise à jour...');

    // Si l'application n'est pas packagée ou sur Linux, on vérifie via l'API GitHub Releases
    if (!app.isPackaged || process.platform === 'linux') {
        try {
            const release = await checkGitHubLatestRelease();
            if (!release) {
                win.webContents.send('update-status', 'Aucune version publiée trouvée sur GitHub.');
                return;
            }
            const latestVer = (release.tag_name || '').replace(/^v\.?/, '');
            const currentVer = app.getVersion();
            if (compareVersions(latestVer, currentVer) > 0) {
                win.webContents.send('update-status', `Une nouvelle version (${release.tag_name}) est disponible sur GitHub !`);
                win.webContents.send('github-update-available', {
                    tagName: release.tag_name,
                    name: release.name || release.tag_name,
                    url: release.html_url,
                    assetUrl: (release.assets && release.assets.length > 0)
                        ? (release.assets.find(a => a.name.endsWith('.exe'))?.browser_download_url || release.assets[0].browser_download_url)
                        : release.html_url
                });
            } else {
                win.webContents.send('update-status', `Vous êtes déjà sur la dernière version (v${currentVer}).`);
            }
        } catch (err) {
            win.webContents.send('update-status', `Erreur lors de la vérification : ${err.message}`);
        }
        return;
    }

    // En production Windows/macOS : autoUpdater avec fallback sécurisé
    try {
        autoUpdater.checkForUpdates();
    } catch (err) {
        console.error('Erreur autoUpdater.checkForUpdates:', err);
        try {
            const release = await checkGitHubLatestRelease();
            if (release) {
                const latestVer = (release.tag_name || '').replace(/^v\.?/, '');
                const currentVer = app.getVersion();
                if (compareVersions(latestVer, currentVer) > 0) {
                    win.webContents.send('update-status', `Mise à jour disponible sur GitHub : ${release.tag_name}`);
                    win.webContents.send('github-update-available', {
                        tagName: release.tag_name,
                        url: release.html_url,
                        assetUrl: (release.assets && release.assets.length > 0)
                            ? (release.assets.find(a => a.name.endsWith('.exe'))?.browser_download_url || release.assets[0].browser_download_url)
                            : release.html_url
                    });
                    return;
                }
            }
            win.webContents.send('update-status', `Vous êtes déjà sur la dernière version (v${app.getVersion()}).`);
        } catch (_) {
            win.webContents.send('update-status', `Erreur lors de la recherche : ${err.message}`);
        }
    }
});

ipcMain.on('install-update', () => {
    if (app.isPackaged) {
        app.isQuiting = true; // Débloque win.on('close') pour permettre à l'installeur de redémarrer l'application
        try {
            autoUpdater.quitAndInstall();
        } catch (err) {
            console.error('Erreur quitAndInstall:', err);
        }
    }
});

ipcMain.handle('open-external-url', async (_, url) => {
    try {
        if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
            await shell.openExternal(url);
            return true;
        }
        return false;
    } catch (e) {
        console.error('Erreur openExternal:', e);
        return false;
    }
});

let win;
let tray;
let DATA_FILE;

function applyAppPriority(enabled) {
    if (process.platform !== 'win32') return false;

    try {
        const priority = enabled
            ? os.constants.priority.PRIORITY_ABOVE_NORMAL
            : os.constants.priority.PRIORITY_NORMAL;
        os.setPriority(process.pid, priority);
        return true;
    } catch (error) {
        console.error('Impossible de modifier la priorité du processus:', error);
        return false;
    }
}

function getSavedHighPriority() {
    try {
        const savedData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        return savedData.settings?.highPriority === true;
    } catch (_) {
        return false;
    }
}

function createWindow() {
    DATA_FILE = path.join(app.getPath('userData'), 'data.json');

    win = new BrowserWindow({
        width: 1250,
        height: 900,
        icon: path.join(__dirname, 'favicon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile('index.html');

    // Cache la fenêtre au lieu de quitter quand on clique sur la croix
    win.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            win.hide();
        }
        return false;
    });
    
    setupUpdater(win);
}

// Notification intelligente basée sur les devoirs
function sendSmartNotification(title, body) {
    if (Notification.isSupported()) {
        const notif = new Notification({
            title,
            body,
            icon: path.join(__dirname, 'favicon.ico')
        });
        notif.show();
        notif.on('click', () => { if (win) win.show(); });
    }
}

// Fonction de notification périodique
function sendScheduledNotification() {
    try {
        if (!fs.existsSync(DATA_FILE)) return;
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const tasks = (data.tasks || []).filter(t => !t.completed);
        if (tasks.length === 0) return;

        const now = new Date();
        const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const urgent = tasks.filter(t => {
            if (!t.date) return false;
            const due = new Date(`${t.date}T${t.time || '23:59'}`);
            return due <= in24h && due >= now;
        });
        const haute = tasks.filter(t => t.priority === 'Haute');

        if (urgent.length > 0) {
            const names = urgent.slice(0, 2).map(t => t.title).join(', ');
            sendSmartNotification(
                `⚠️ ${urgent.length} devoir(s) à rendre bientôt !`,
                names + (urgent.length > 2 ? ` et ${urgent.length - 2} autres...` : '')
            );
        } else if (haute.length > 0) {
            sendSmartNotification(
                `📚 ${tasks.length} devoir(s) en attente`,
                `Priorité haute : ${haute[0].title} — ${haute[0].subject}`
            );
        } else if (tasks.length > 0) {
            sendSmartNotification(
                `📝 ${tasks.length} devoir(s) à faire`,
                `N'oublie pas : ${tasks[0].title}`
            );
        }
    } catch (e) {
        console.error('Erreur notification:', e);
    }
}

// Création de l'icône près de l'horloge
function createTray() {
    // Linux (et certains systèmes) exigent un PNG pour le tray — pas d'ICO
    const trayIconName = process.platform === 'linux' ? 'favicon.png' : 'favicon.ico';
    tray = new Tray(path.join(__dirname, trayIconName));
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Ouvrir HomeworkPlanner', click: () => win.show() },
        { type: 'separator' },
        {
            label: 'Quitter définitivement', click: () => {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);
    tray.setToolTip('HomeworkPlanner');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => win.show());
}

// IPC Handlers pour le stockage
ipcMain.handle('save-data', (_, data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (e) { return false; }
});

ipcMain.handle('set-app-priority', (_, enabled) => applyAppPriority(enabled === true));

ipcMain.handle('load-data', () => {
    try {
        let data = null;
        if (fs.existsSync(DATA_FILE)) {
            try {
                data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            } catch (err) {
                console.error("Fichier de données corrompu. Création d'une sauvegarde.");
                fs.copyFileSync(DATA_FILE, DATA_FILE + '.corrupted.bak');
            }
        }
        
        if (!data) {
            // Si pas de fichier sauvegardé, charger les données par défaut depuis data.json
            const defaultDataPath = path.join(__dirname, 'data.json');
            if (fs.existsSync(defaultDataPath)) {
                data = JSON.parse(fs.readFileSync(defaultDataPath, 'utf8'));
            }
        }
        
        if (data) {
            // Migration automatique
            if (!data.grades) data.grades = [];
            if (!data.archives) data.archives = [];
            if (data.onboardingDone === undefined) data.onboardingDone = false;
            if (!data.settings) data.settings = { customTheme: { primary: '#818cf8', accent: '#c084fc', bg: '#020617', card: '#1e293b' } };
            return data;
        }
        return null;
    } catch (e) { return null; }
});

ipcMain.handle('export-data', async () => {
    try {
        const { canceled, filePath } = await dialog.showSaveDialog({
            title: 'Exporter les données',
            defaultPath: path.join(app.getPath('documents'), 'HomeworkPlanner_backup.json'),
            filters: [{ name: 'Fichiers JSON', extensions: ['json'] }]
        });
        
        if (canceled || !filePath) return { success: false };
        
        if (fs.existsSync(DATA_FILE)) {
            fs.copyFileSync(DATA_FILE, filePath);
            return { success: true, path: filePath };
        } else {
            // Si le fichier n'existe pas encore, on crée un fichier par défaut
            fs.writeFileSync(filePath, JSON.stringify({ tasks: [], courses: [] }, null, 2));
            return { success: true, path: filePath };
        }
    } catch (e) {
        console.error("Erreur lors de l'export:", e);
        return { success: false, error: e.message };
    }
});

ipcMain.handle('import-data', async () => {
    try {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            title: 'Importer des données',
            filters: [{ name: 'Fichiers JSON', extensions: ['json'] }],
            properties: ['openFile']
        });

        if (canceled || filePaths.length === 0) return { success: false };

        const filePath = filePaths[0];
        
        // Validation simple
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);
        
        // Copier vers le fichier de données principal
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return { success: true };
    } catch (e) {
        console.error("Erreur lors de l'import:", e);
        return { success: false, error: e.message };
    }
});

// ATTACHMENTS_DIR est résolu à la demande (après que app soit prêt)
function getAttachmentsDir() {
    return path.join(app.getPath('userData'), 'attachments');
}

ipcMain.handle('save-attachment', async (_, { filePath, fileName }) => {
    try {
        const attachmentsDir = getAttachmentsDir();
        if (!fs.existsSync(attachmentsDir)) {
            fs.mkdirSync(attachmentsDir, { recursive: true });
        }
        const destPath = path.join(attachmentsDir, `${Date.now()}_${fileName}`);
        fs.copyFileSync(filePath, destPath);
        return { success: true, path: destPath, fileName };
    } catch (e) {
        console.error("Erreur lors de l'enregistrement de la pièce jointe:", e);
        return { success: false, error: e.message };
    }
});

ipcMain.handle('open-attachment', async (_, attachmentPath) => {
    try {
        shell.openPath(attachmentPath);
        return { success: true };
    } catch (e) {
        console.error("Erreur lors de l'ouverture de la pièce jointe:", e);
        return { success: false, error: e.message };
    }
});

ipcMain.handle('export-ics', async (_, events) => {
    try {
        const { canceled, filePath } = await dialog.showSaveDialog({
            title: 'Exporter le calendrier ICS',
            defaultPath: path.join(app.getPath('documents'), 'HomeworkPlanner.ics'),
            filters: [{ name: 'Fichiers iCalendar', extensions: ['ics'] }]
        });

        if (canceled || !filePath) return { success: false };

        // createEvents est synchrone dans les versions récentes de ics ;
        // on l'enveloppe dans une Promise pour gérer les deux styles d'API.
        await new Promise((resolve, reject) => {
            const result = ics.createEvents(events, (error, value) => {
                if (error) { reject(error); return; }
                fs.writeFileSync(filePath, value);
                resolve();
            });
            // Si l'API est synchrone (pas de callback utilisé)
            if (result && result.error) { reject(result.error); }
            else if (result && result.value) {
                fs.writeFileSync(filePath, result.value);
                resolve();
            }
        });
        return { success: true, path: filePath };
    } catch (e) {
        console.error("Erreur lors de l'export ICS:", e);
        return { success: false, error: e.message };
    }
});

ipcMain.handle('open-pdf', async (_, pdfPath) => {
    try {
        // En développement, utiliser __dirname; en production, utiliser app.getAppPath()
        const basePath = app.isPackaged ? app.getAppPath() : __dirname;
        const filePath = path.join(basePath, pdfPath);
        console.log("Tentative d'ouverture du PDF:", filePath);
        
        if (!fs.existsSync(filePath)) {
            console.log('Fichier non trouvé. Base path:', basePath);
            return false;
        }

        // Ouvrir avec l'application par défaut de l'OS
        const result = await shell.openPath(filePath);
        if (result !== '') {
            console.error('Erreur shell.openPath:', result);
            return false;
        }
        return true;
    } catch (e) {
        console.error('Erreur lors de l\'ouverture du PDF:', e);
        return false;
    }
});

// Télécharger/copier un PDF vers le dossier de téléchargements
ipcMain.handle('download-pdf', async (_, pdfPath) => {
    try {
        // En développement, utiliser __dirname; en production, utiliser app.getAppPath()
        const basePath = app.isPackaged ? app.getAppPath() : __dirname;
        const sourcePath = path.join(basePath, pdfPath);

        console.log('Tentative de téléchargement depuis:', sourcePath);
        console.log('chemin existe:', fs.existsSync(sourcePath));

        if (!fs.existsSync(sourcePath)) {
            console.log('PDF source non trouvé. Base path:', basePath);
            return { success: false, message: 'Fichier PDF non trouvé' };
        }

        const fileName = path.basename(sourcePath);
        const downloadDir = app.getPath('downloads');
        const destPath = path.join(downloadDir, fileName);

        // Copier le fichier
        fs.copyFileSync(sourcePath, destPath);
        console.log('PDF copié vers:', destPath);

        return { success: true, path: destPath, message: `PDF enregistré dans: ${downloadDir}` };
    } catch (e) {
        console.error('Erreur lors du téléchargement:', e);
        return { success: false, message: 'Erreur lors du téléchargement' };
    }
});

ipcMain.handle('load-pdf', (_, pdfPath) => {
    try {
        // En développement, utiliser __dirname; en production, utiliser app.getAppPath()
        const basePath = app.isPackaged ? app.getAppPath() : __dirname;
        const filePath = path.join(basePath, pdfPath);
        console.log('Chargement du PDF:', filePath);
        console.log('Fichier existe:', fs.existsSync(filePath));
        if (fs.existsSync(filePath)) {
            const pdfBuffer = fs.readFileSync(filePath);
            // Convertir en base64 pour passer via IPC
            return pdfBuffer.toString('base64');
        }
        console.log('Fichier non trouvé. Base path:', basePath);
        return null;
    } catch (e) {
        console.error('Erreur lors du chargement du PDF:', e);
        return null;
    }
});

app.whenReady().then(() => {
    app.setAppUserModelId('com.batsmg0869.planner');
    DATA_FILE = path.join(app.getPath('userData'), 'data.json');
    applyAppPriority(getSavedHighPriority());
    createWindow();
    createTray();

    // Démarrage automatique (non supporté sur Linux via cette API)
    if (process.platform !== 'linux') {
        app.setLoginItemSettings({
            openAtLogin: true,
            path: app.getPath('exe')
        });
    }

    // Notification intelligente toutes les 30 minutes
    setInterval(sendScheduledNotification, 30 * 60 * 1000);

    // Vérification des devoirs urgents au lancement (après 5 secondes)
    setTimeout(() => {
        try {
            if (!fs.existsSync(DATA_FILE)) return;
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            const tasks = (data.tasks || []).filter(t => !t.completed);
            const now = new Date();
            const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            const urgent = tasks.filter(t => {
                if (!t.date) return false;
                const due = new Date(`${t.date}T${t.time || '23:59'}`);
                return due <= in24h && due >= now;
            });
            if (urgent.length > 0) {
                sendSmartNotification(
                    `⚠️ Rappel : ${urgent.length} devoir(s) à rendre dans 24h`,
                    urgent.slice(0, 2).map(t => `${t.subject}: ${t.title}`).join(' | ')
                );
            }
        } catch (e) { console.error('Erreur vérif urgents:', e); }
    }, 5000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { /* On ne fait rien pour garder le tray actif */ }
});