const { app, BrowserWindow, ipcMain, Notification, Tray, Menu, shell, dialog, autoUpdater } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const ics = require('ics');
const https = require('https');

// Gérer immédiatement les événements d'installation Squirrel (Windows) pour éviter
// l'ouverture prématurée d'une fenêtre blanche lors de l'exécution de l'installeur
function handleSquirrelStartup() {
    if (process.platform !== 'win32') return false;
    const squirrelEvent = process.argv.find(arg => typeof arg === 'string' && arg.startsWith('--squirrel-'));
    if (!squirrelEvent || squirrelEvent === '--squirrel-firstrun') return false;

    const rootFolder = path.resolve(path.dirname(process.execPath), '..');
    const updateDotExe = path.join(rootFolder, 'Update.exe');
    const exeName = path.basename(process.execPath);

    const spawnUpdate = (args, done) => {
        try {
            if (fs.existsSync(updateDotExe)) {
                const child = spawn(updateDotExe, args, { detached: true });
                child.on('close', done);
                return;
            }
        } catch (_) {}
        done();
    };

    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            spawnUpdate(['--createShortcut', exeName], () => {
                app.quit();
                process.exit(0);
            });
            return true;
        case '--squirrel-uninstall':
            spawnUpdate(['--removeShortcut', exeName], () => {
                app.quit();
                process.exit(0);
            });
            return true;
        case '--squirrel-obsolete':
            app.quit();
            process.exit(0);
            return true;
    }
    return false;
}

if (handleSquirrelStartup()) {
    process.exit(0);
}


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

function checkGitHubAllReleases() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: '/repos/Batsmg0869/app-cours/releases',
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


ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});

ipcMain.handle('get-github-releases', async () => {
    try {
        const releases = await checkGitHubAllReleases();
        if (!Array.isArray(releases)) return [];
        return releases.map(r => {
            const exeAsset = r.assets ? r.assets.find(a => a.name.endsWith('.exe')) : null;
            const zipAsset = r.assets ? r.assets.find(a => a.name.endsWith('.zip')) : null;
            const asset = exeAsset || zipAsset || (r.assets && r.assets[0]);
            return {
                id: r.id,
                tagName: r.tag_name,
                name: r.name || r.tag_name,
                publishedAt: r.published_at,
                body: r.body || '',
                htmlUrl: r.html_url,
                assetUrl: asset ? asset.browser_download_url : null,
                assetName: asset ? asset.name : null,
                assetSize: asset ? asset.size : null
            };
        });
    } catch (err) {
        console.error('Erreur get-github-releases:', err);
        return [];
    }
});

let currentDownloadReq = null;

ipcMain.handle('download-update-file', async (event, { url, fileName, versionName }) => {
    try {
        if (!url) throw new Error('URL de téléchargement manquante');

        const tempDir = app.getPath('temp');
        const safeName = fileName || `homework-planner-update-${(versionName || 'latest').replace(/[^a-zA-Z0-9._-]/g, '_')}.exe`;
        const destPath = path.join(tempDir, safeName);

        if (fs.existsSync(destPath)) {
            try { fs.unlinkSync(destPath); } catch (_) {}
        }

        const downloadWithRedirects = (currentUrl, redirectCount = 0) => {
            return new Promise((resolve, reject) => {
                if (redirectCount > 10) return reject(new Error('Trop de redirections'));

                const req = https.get(currentUrl, {
                    headers: { 'User-Agent': 'HomeworkPlanner-App' }
                }, (res) => {
                    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                        return resolve(downloadWithRedirects(res.headers.location, redirectCount + 1));
                    }
                    if (res.statusCode !== 200) {
                        return reject(new Error(`Erreur HTTP lors du téléchargement : ${res.statusCode}`));
                    }

                    const totalBytes = parseInt(res.headers['content-length'] || '0', 10);
                    let receivedBytes = 0;
                    const fileStream = fs.createWriteStream(destPath);

                    res.on('data', (chunk) => {
                        receivedBytes += chunk.length;
                        const percent = totalBytes > 0 ? Math.min(100, Math.round((receivedBytes / totalBytes) * 100)) : 0;
                        if (win && !win.isDestroyed()) {
                            win.webContents.send('download-progress', {
                                percent,
                                receivedBytes,
                                totalBytes,
                                versionName
                            });
                        }
                    });

                    res.pipe(fileStream);

                    fileStream.on('finish', () => {
                        fileStream.close(() => {
                            resolve({ success: true, filePath: destPath, versionName });
                        });
                    });

                    fileStream.on('error', (err) => {
                        try { fs.unlinkSync(destPath); } catch (_) {}
                        reject(err);
                    });
                });

                currentDownloadReq = req;
                req.on('error', (err) => reject(err));
            });
        };

        const result = await downloadWithRedirects(url);
        return result;
    } catch (err) {
        console.error('Erreur download-update-file:', err);
        return { success: false, error: err.message };
    }
});

ipcMain.handle('install-downloaded-update', async (_, { filePath, versionName }) => {
    try {
        if (!filePath || !fs.existsSync(filePath)) {
            return { success: false, error: "Fichier d'installation introuvable." };
        }

        sendSmartNotification(
            'Installation en cours...',
            `L'application va se fermer pour installer la mise à jour ${versionName || ''}. Elle redémarrera automatiquement.`
        );

        const child = spawn(filePath, [], {
            detached: true,
            stdio: 'ignore'
        });
        child.unref();

        setTimeout(() => {
            app.isQuiting = true;
            app.quit();
        }, 1200);

        return { success: true };
    } catch (err) {
        console.error('Erreur install-downloaded-update:', err);
        return { success: false, error: err.message };
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
        backgroundColor: '#0b0f19',
        show: false,
        icon: path.join(__dirname, 'favicon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.once('ready-to-show', () => {
        if (win && !win.isDestroyed()) {
            win.show();
        }
    });

    setTimeout(() => {
        if (win && !win.isDestroyed() && !win.isVisible()) {
            win.show();
        }
    }, 3000);

    const distIndex = path.join(__dirname, 'dist', 'index.html');
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else if (fs.existsSync(distIndex)) {
        win.loadFile(distIndex);
    } else {
        win.loadFile('index.html');
    }

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
async function sendScheduledNotification() {
    try {
        if (!fs.existsSync(DATA_FILE)) return;
        const raw = await fs.promises.readFile(DATA_FILE, 'utf8');
        const data = JSON.parse(raw);
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
ipcMain.handle('save-data', async (_, data) => {
    try {
        const jsonStr = JSON.stringify(data);
        const tempFile = `${DATA_FILE}.tmp`;
        await fs.promises.writeFile(tempFile, jsonStr, 'utf8');
        await fs.promises.rename(tempFile, DATA_FILE);
        return true;
    } catch (e) {
        console.error('Erreur save-data:', e);
        return false;
    }
});

ipcMain.handle('set-app-priority', (_, enabled) => applyAppPriority(enabled === true));

ipcMain.handle('load-data', async () => {
    try {
        let data = null;
        if (fs.existsSync(DATA_FILE)) {
            try {
                const content = await fs.promises.readFile(DATA_FILE, 'utf8');
                data = JSON.parse(content);
            } catch (err) {
                console.error("Fichier de données corrompu. Création d'une sauvegarde.");
                try {
                    await fs.promises.copyFile(DATA_FILE, DATA_FILE + '.corrupted.bak');
                } catch (_) {}
            }
        }
        
        if (!data) {
            // Si pas de fichier sauvegardé, charger les données par défaut depuis data.json
            const defaultDataPath = path.join(__dirname, 'data.json');
            if (fs.existsSync(defaultDataPath)) {
                try {
                    const defaultContent = await fs.promises.readFile(defaultDataPath, 'utf8');
                    data = JSON.parse(defaultContent);
                } catch (_) {}
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

ipcMain.handle('save-attachment', async (_, payload) => {
    try {
        const { filePath, fileName, content, name } = payload || {};
        const attachmentsDir = getAttachmentsDir();
        if (!fs.existsSync(attachmentsDir)) {
            await fs.promises.mkdir(attachmentsDir, { recursive: true });
        }
        const resolvedName = fileName || name || 'document.pdf';
        const destPath = path.join(attachmentsDir, `${Date.now()}_${resolvedName}`);

        if (filePath && fs.existsSync(filePath)) {
            await fs.promises.copyFile(filePath, destPath);
        } else if (content) {
            const buf = Buffer.from(content, 'base64');
            await fs.promises.writeFile(destPath, buf);
        } else {
            return { success: false, error: 'Aucun fichier ni contenu fourni' };
        }
        return { success: true, path: destPath, fileName: resolvedName };
    } catch (e) {
        console.error("Erreur lors de l'enregistrement de la pièce jointe:", e);
        return { success: false, error: e.message };
    }
});

ipcMain.handle('open-attachment', async (_, attachmentPath) => {
    try {
        const resolved = resolvePdfPath(attachmentPath) || attachmentPath;
        const err = await shell.openPath(resolved);
        if (err) {
            console.error('Erreur shell.openPath pièce jointe:', err);
            return { success: false, error: err };
        }
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

function resolvePdfPath(inputPath) {
    if (!inputPath || typeof inputPath !== 'string') return null;

    // Nettoyer si accidentellement préfixé par 'Cours/' devant un chemin absolu
    let cleanPath = inputPath;
    if (cleanPath.startsWith('Cours/') || cleanPath.startsWith('Cours\\')) {
        const withoutPrefix = cleanPath.slice(6);
        if (path.isAbsolute(withoutPrefix)) {
            cleanPath = withoutPrefix;
        }
    }

    // 1. Si cleanPath est déjà un chemin absolu valide
    if (path.isAbsolute(cleanPath) && fs.existsSync(cleanPath)) {
        return cleanPath;
    }

    // 2. Si cleanPath existe tel quel
    if (fs.existsSync(cleanPath)) {
        return path.resolve(cleanPath);
    }

    const basePath = app.isPackaged ? app.getAppPath() : __dirname;

    // 3. Chercher dans basePath/cleanPath
    let candidate = path.join(basePath, cleanPath);
    if (fs.existsSync(candidate)) return candidate;

    // 4. Chercher dans basePath/Cours/cleanPath
    candidate = path.join(basePath, 'Cours', cleanPath);
    if (fs.existsSync(candidate)) return candidate;

    // 5. Chercher dans le dossier attachments
    const attachmentsDir = getAttachmentsDir();
    candidate = path.join(attachmentsDir, path.basename(cleanPath));
    if (fs.existsSync(candidate)) return candidate;

    return null;
}

ipcMain.handle('open-pdf', async (_, pdfPath) => {
    try {
        const filePath = resolvePdfPath(pdfPath);
        console.log("Tentative d'ouverture du PDF résolu:", filePath, "pour:", pdfPath);
        
        if (!filePath) {
            console.log('Fichier PDF non trouvé pour:', pdfPath);
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
        const sourcePath = resolvePdfPath(pdfPath);
        console.log('Tentative de téléchargement depuis:', sourcePath, 'pour:', pdfPath);

        if (!sourcePath) {
            console.log('PDF source non trouvé pour:', pdfPath);
            return { success: false, message: 'Fichier PDF non trouvé' };
        }

        const fileName = path.basename(sourcePath);
        const downloadDir = app.getPath('downloads');
        const destPath = path.join(downloadDir, fileName);

        // Copier le fichier de façon asynchrone
        await fs.promises.copyFile(sourcePath, destPath);
        console.log('PDF copié vers:', destPath);

        return { success: true, path: destPath, message: `PDF enregistré dans: ${downloadDir}` };
    } catch (e) {
        console.error('Erreur lors du téléchargement:', e);
        return { success: false, message: 'Erreur lors du téléchargement' };
    }
});

ipcMain.handle('load-pdf', async (_, pdfPath) => {
    try {
        const filePath = resolvePdfPath(pdfPath);
        console.log('Chargement du PDF résolu:', filePath, 'pour:', pdfPath);
        if (filePath && fs.existsSync(filePath)) {
            const pdfBuffer = await fs.promises.readFile(filePath);
            // Convertir en base64 pour passer via IPC
            return pdfBuffer.toString('base64');
        }
        console.log('Fichier PDF non trouvé pour:', pdfPath);
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
    setTimeout(async () => {
        try {
            if (!fs.existsSync(DATA_FILE)) return;
            const raw = await fs.promises.readFile(DATA_FILE, 'utf8');
            const data = JSON.parse(raw);
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