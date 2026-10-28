const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('storage', {
    isWindows: process.platform === 'win32',
    save: (data) => ipcRenderer.invoke('save-data', data),
    load: () => ipcRenderer.invoke('load-data'),
    setAppPriority: (enabled) => ipcRenderer.invoke('set-app-priority', enabled),
    openPDF: (pdfPath) => ipcRenderer.invoke('open-pdf', pdfPath),
    loadPDF: (pdfPath) => ipcRenderer.invoke('load-pdf', pdfPath),
    downloadPDF: (pdfPath) => ipcRenderer.invoke('download-pdf', pdfPath),
    exportData: () => ipcRenderer.invoke('export-data'),
    importData: () => ipcRenderer.invoke('import-data'),
    saveAttachment: (data) => ipcRenderer.invoke('save-attachment', data),
    openAttachment: (path) => ipcRenderer.invoke('open-attachment', path),
    exportICS: (events) => ipcRenderer.invoke('export-ics', events)
});

contextBridge.exposeInMainWorld('updater', {
    checkForUpdates: () => ipcRenderer.send('check-for-updates'),
    installUpdate: () => ipcRenderer.send('install-update'),
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    getReleases: () => ipcRenderer.invoke('get-github-releases'),
    downloadUpdate: (data) => ipcRenderer.invoke('download-update-file', data),
    installDownloadedUpdate: (data) => ipcRenderer.invoke('install-downloaded-update', data),
    openExternal: (url) => ipcRenderer.invoke('open-external-url', url),
    onUpdateStatus: (callback) => {
        ipcRenderer.removeAllListeners('update-status');
        ipcRenderer.on('update-status', (_, message) => callback(message));
    },
    onUpdateDownloaded: (callback) => {
        ipcRenderer.removeAllListeners('update-downloaded');
        ipcRenderer.on('update-downloaded', (_, releaseName) => callback(releaseName));
    },
    onGithubUpdateAvailable: (callback) => {
        ipcRenderer.removeAllListeners('github-update-available');
        ipcRenderer.on('github-update-available', (_, info) => callback(info));
    },
    onDownloadProgress: (callback) => {
        ipcRenderer.removeAllListeners('download-progress');
        ipcRenderer.on('download-progress', (_, progress) => callback(progress));
    }
});
