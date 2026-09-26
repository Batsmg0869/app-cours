const { app, BrowserWindow, ipcMain, Notification, Tray, Menu, shell, dialog, autoUpdater } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const ics = require('ics');

function setupUpdater(win) {
    if (!app.isPackaged) return; // Uniquement en prod

    const server = 'https://update.electronjs.org';
    const feed = `${server}/Batsmg0869/app-cours/${process.platform}-${process.arch}/${app.getVersion()}`;

    try {
        autoUpdater.setFeedURL({ url: feed });
    } catch (e) {
        console.error('Erreur setFeedURL:', e);
    }

    autoUpdater.on('update-available', () => {
        if (win) win.webContents.send('update-status', 'Mise à jour trouvée. Téléchargement en cours...');
    });

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        if (win) win.webContents.send('update-downloaded', releaseName);
    });

    autoUpdater.on('error', (err) => {
        const errMsg = err && err.message ? err.message : String(err);
        if (win) win.webContents.send('update-status', `Erreur lors de la recherche : ${errMsg}`);
        console.error('Erreur mise à jour:', err);
    });

    autoUpdater.on('update-not-available', () => {
        if (win) win.webContents.send('update-status', 'Vous êtes déjà à la dernière version.');
    });
}

ipcMain.on('check-for-updates', (event) => {
    if (!app.isPackaged) {
        if (win) win.webContents.send('update-status', 'Les mises à jour sont désactivées en mode développement.');
        return;
    }
    if (win) win.webContents.send('update-status', 'Recherche de mise à jour...');
    autoUpdater.checkForUpdates();
});

ipcMain.on('install-update', () => {
    if (app.isPackaged) {
        autoUpdater.quitAndInstall();
    }
});

let win;
let tray;
let DATA_FILE;

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

// Fonction de notification
function sendScheduledNotification() {
    if (Notification.isSupported()) {
        const notif = new Notification({
            title: 'Rappel Devoirs',
            body: 'Oublie pas de finir tes devoirs',
            icon: path.join(__dirname, 'favicon.ico')
        });
        notif.show();
        notif.on('click', () => win.show());
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
    createWindow();
    createTray();

    // Démarrage automatique (non supporté sur Linux via cette API)
    if (process.platform !== 'linux') {
        app.setLoginItemSettings({
            openAtLogin: true,
            path: app.getPath('exe')
        });
    }

    // Notification toutes les 30 minutes
    setInterval(sendScheduledNotification, 30 * 60 * 1000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { /* On ne fait rien pour garder le tray actif */ }
});