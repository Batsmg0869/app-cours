import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ReleaseAssetInfo, GitHubUpdateInfo, DownloadProgress } from '../types';

function compareSemver(v1: string, v2: string): number {
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

function formatBytes(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return 'Taille inconnue';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} Mo`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export const SettingsView: React.FC = () => {
  const { data, updateSettings, setActiveModal, showToast } = useApp();

  const [usernameInput, setUsernameInput] = useState(data.userName || data.settings.userName || 'Baptiste Lecuyot');
  const [appVersion, setAppVersion] = useState<string>('2.5.6');
  const [updaterMsg, setUpdaterMsg] = useState<string | null>(null);
  const [checkingUpdates, setCheckingUpdates] = useState<boolean>(false);
  const [latestRelease, setLatestRelease] = useState<ReleaseAssetInfo | GitHubUpdateInfo | null>(null);
  const [isLatestNewer, setIsLatestNewer] = useState<boolean>(false);

  // Sélecteur de version spécifique
  const [allReleases, setAllReleases] = useState<ReleaseAssetInfo[]>([]);
  const [loadingReleases, setLoadingReleases] = useState<boolean>(false);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>('');

  // Téléchargement et installation avec suivi de progression
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'downloaded' | 'installing' | 'error'>('idle');
  const [downloadTargetVersion, setDownloadTargetVersion] = useState<string>('');
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress>({ percent: 0, receivedBytes: 0, totalBytes: 0 });
  const [downloadedFilePath, setDownloadedFilePath] = useState<string | null>(null);
  const [installErrorMsg, setInstallErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (data.userName || data.settings?.userName) {
      setUsernameInput(data.userName || data.settings?.userName || '');
    }
  }, [data.userName, data.settings?.userName]);

  useEffect(() => {
    // Récupérer la version réelle de l'application
    if (window.updater?.getAppVersion) {
      window.updater.getAppVersion().then(v => {
        if (v) setAppVersion(v);
      }).catch(() => {});
    }

    // Écouter la progression du téléchargement en temps réel
    if (window.updater?.onDownloadProgress) {
      window.updater.onDownloadProgress((prog) => {
        setDownloadProgress(prog);
        setDownloadState('downloading');
      });
    }

    // Écouter si autoUpdater a téléchargé une mise à jour
    if (window.updater?.onUpdateDownloaded) {
      window.updater.onUpdateDownloaded((releaseName) => {
        setDownloadState('downloaded');
        setDownloadTargetVersion(releaseName);
        showToast(`Mise à jour ${releaseName} prête à être installée !`, 'success');
      });
    }

    // Charger initialement toutes les versions disponibles depuis GitHub
    loadAllReleases();
  }, []);

  const loadAllReleases = async () => {
    setLoadingReleases(true);
    try {
      if (window.updater?.getReleases) {
        const releases = await window.updater.getReleases();
        if (Array.isArray(releases) && releases.length > 0) {
          setAllReleases(releases);
          return;
        }
      }
      // Repli si test hors Electron
      const res = await fetch('https://api.github.com/repos/Batsmg0869/app-cours/releases');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) {
          setAllReleases(json.map((r: any) => {
            const exeAsset = r.assets ? r.assets.find((a: any) => a.name.endsWith('.exe')) : null;
            const zipAsset = r.assets ? r.assets.find((a: any) => a.name.endsWith('.zip')) : null;
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
          }));
        }
      }
    } catch (e) {
      console.warn('Erreur lors du chargement des releases:', e);
    } finally {
      setLoadingReleases(false);
    }
  };

  const themes = [
    { key: 'emerald', name: 'Vert', color: '#10b981' },
    { key: 'indigo', name: 'Bleu', color: '#818cf8' },
    { key: 'ruby', name: 'Rouge', color: '#f43f5e' },
    { key: 'amethyst', name: 'Violet', color: '#c084fc' },
    { key: 'amber', name: 'Orange', color: '#f59e0b' },
    { key: 'sky', name: 'Bleu ciel', color: '#0ea5e9' },
    { key: 'apple', name: 'Clair', color: '#0071e3' },
    { key: 'minecraft', name: 'Minecraft', color: '#5B8731' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    updateSettings({ userName: usernameInput.trim() });
    showToast('Profil enregistré', 'success');
  };

  const handleThemeSelect = (themeKey: string) => {
    updateSettings({ theme: themeKey });
    document.body.setAttribute('data-theme', themeKey);
    document.documentElement.setAttribute('data-theme', themeKey);
  };

  const handleTogglePriority = async (checked: boolean) => {
    updateSettings({ highPriority: checked });
    if (window.storage?.setAppPriority) {
      await window.storage.setAppPriority(checked);
    }
  };

  const handleExportData = async () => {
    if (window.storage?.exportData) {
      const ok = await window.storage.exportData();
      if (ok) showToast('Données exportées avec succès !', 'success');
      else showToast('Exportation annulée ou impossible', 'info');
    }
  };

  const handleImportData = async () => {
    if (window.storage?.importData) {
      const imported = await window.storage.importData();
      if (imported) {
        showToast('Données importées avec succès ! Recharge...', 'success');
        setTimeout(() => window.location.reload(), 800);
      }
    }
  };

  // 1. Bouton pour la version la plus récente
  const handleCheckUpdates = async () => {
    setCheckingUpdates(true);
    setUpdaterMsg('Recherche de la dernière version sur GitHub...');
    setLatestRelease(null);
    setIsLatestNewer(false);

    try {
      if (window.updater?.checkForUpdates) {
        window.updater.checkForUpdates();
        window.updater.onUpdateStatus((msg) => {
          setUpdaterMsg(msg);
        });
        window.updater.onGithubUpdateAvailable((info) => {
          setLatestRelease(info);
          setIsLatestNewer(true);
          setUpdaterMsg(`Nouvelle version ${info.tagName} disponible !`);
          setCheckingUpdates(false);
        });
      }

      if (window.updater?.getReleases) {
        const rels = await window.updater.getReleases();
        if (Array.isArray(rels) && rels.length > 0) {
          setAllReleases(rels);
          const top = rels[0];
          const isNewer = compareSemver(top.tagName, appVersion) > 0;
          if (isNewer) {
            setLatestRelease(top);
            setIsLatestNewer(true);
            setUpdaterMsg(`Une nouvelle version (${top.tagName}) est disponible !`);
          } else {
            setUpdaterMsg(`Tu utilises déjà la version la plus récente (v${appVersion}).`);
          }
        }
      } else {
        setTimeout(() => {
          setUpdaterMsg(`Tu utilises déjà la version la plus récente (v${appVersion}).`);
          setCheckingUpdates(false);
        }, 700);
      }
    } catch (err: any) {
      setUpdaterMsg(`Erreur : ${err.message || 'connexion impossible'}`);
    } finally {
      setTimeout(() => setCheckingUpdates(false), 900);
    }
  };

  // 2. Lancer le téléchargement d'une version (la dernière ou une version choisie)
  const handleStartDownload = async (release: ReleaseAssetInfo | GitHubUpdateInfo) => {
    const tagName = release.tagName || 'latest';
    const assetUrl = (release as ReleaseAssetInfo).assetUrl || (release as GitHubUpdateInfo).assetUrl;
    const fileName = (release as ReleaseAssetInfo).assetName || `homework-planner-${tagName}-setup.exe`;
    const assetSize = (release as ReleaseAssetInfo).assetSize || 0;

    if (!assetUrl) {
      const pageUrl = (release as any).htmlUrl || (release as any).url;
      if (pageUrl) {
        if (window.updater?.openExternal) {
          await window.updater.openExternal(pageUrl);
        } else {
          window.open(pageUrl, '_blank');
        }
        showToast('Aucun exécutable Windows direct, ouverture sur GitHub...', 'info');
      } else {
        showToast('Lien de téléchargement introuvable', 'error');
      }
      return;
    }

    setDownloadState('downloading');
    setDownloadTargetVersion(tagName);
    setDownloadProgress({ percent: 0, receivedBytes: 0, totalBytes: assetSize });
    setInstallErrorMsg(null);

    if (window.updater?.downloadUpdate) {
      const res = await window.updater.downloadUpdate({
        url: assetUrl,
        fileName,
        versionName: tagName
      });

      if (res && res.success && res.filePath) {
        setDownloadedFilePath(res.filePath);
        setDownloadState('downloaded');
        showToast(`Téléchargement de ${tagName} terminé ! Prêt pour l'installation.`, 'success');
      } else {
        setDownloadState('error');
        setInstallErrorMsg(res?.error || 'Erreur lors du téléchargement.');
        showToast('Échec du téléchargement', 'error');
      }
    } else {
      window.open(assetUrl, '_blank');
      setDownloadState('idle');
    }
  };

  // 3. Lancer l'installation sans écran blanc avec indication claire
  const handleInstallDownloaded = async () => {
    if (!downloadedFilePath) {
      if (window.updater?.installUpdate) {
        setDownloadState('installing');
        window.updater.installUpdate();
      }
      return;
    }

    setDownloadState('installing');
    if (window.updater?.installDownloadedUpdate) {
      const res = await window.updater.installDownloadedUpdate({
        filePath: downloadedFilePath,
        versionName: downloadTargetVersion
      });
      if (!res.success) {
        setDownloadState('error');
        setInstallErrorMsg(res.error || "Impossible de démarrer l'installeur.");
        showToast("Erreur lors du lancement de l'installation", 'error');
      }
    }
  };

  const selectedRelease = allReleases.find(r => String(r.id) === String(selectedReleaseId));

  return (
    <div className="tab-pane active" id="tab-settings" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Paramètres & Préférences</h2>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Personnalise ton interface, tes performances et tes sauvegardes
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* PROFIL */}
        <div className="section-card" style={{ padding: '24px 28px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph-bold ph-user" style={{ color: 'var(--primary)' }}></i> Profil Utilisateur
          </h3>

          <form onSubmit={handleSaveProfile}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--text-dim)', fontWeight: 600 }}>
                Prénom affiché dans l'application
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Ton prénom..."
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontSize: '0.95rem',
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              <i className="ph-bold ph-check"></i> Enregistrer le nom
            </button>
          </form>
        </div>

        {/* THÈMES & COULEURS */}
        <div className="section-card" style={{ padding: '24px 28px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph-bold ph-palette" style={{ color: 'var(--accent)' }}></i> Thèmes & Ambiance
          </h3>

          <p style={{ margin: '0 0 14px 0', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            Sélectionne l'ambiance lumineuse et chromatique de l'interface :
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {themes.map((t) => {
              const isSelected = data.settings.theme === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => handleThemeSelect(t.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: isSelected ? `2px solid ${t.color}` : '1px solid var(--border)',
                    background: isSelected ? 'var(--bg-card)' : 'var(--bg-input)',
                    color: isSelected ? '#fff' : 'var(--text)',
                    cursor: 'pointer',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.85rem',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <span
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: t.color,
                      boxShadow: isSelected ? `0 0 10px ${t.color}` : undefined,
                      flexShrink: 0,
                    }}
                  />
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Typographie Rétro Minecraft</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Activer la police pixel art</div>
            </div>
            <input
              type="checkbox"
              checked={data.settings.fontFamily === 'minecraft'}
              onChange={(e) => {
                const font = e.target.checked ? 'minecraft' : 'inter';
                updateSettings({ fontFamily: font });
                document.body.style.fontFamily = font === 'minecraft' ? 'Minecraft, sans-serif' : '';
              }}
              style={{ cursor: 'pointer', transform: 'scale(1.25)' }}
            />
          </div>
        </div>

        {/* PERFORMANCES & SYSTÈME */}
        <div className="section-card" style={{ padding: '24px 28px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph-bold ph-gauge" style={{ color: 'var(--warning)' }}></i> Performances & Système
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Priorité CPU Élevée (Windows)</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Donne la priorité au processus pour une réactivité maximale
              </div>
            </div>
            <input
              type="checkbox"
              checked={data.settings.highPriority || false}
              onChange={(e) => handleTogglePriority(e.target.checked)}
              style={{ cursor: 'pointer', transform: 'scale(1.25)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Notifications de Rappel Intelligentes</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Alerte uniquement quand des devoirs urgents sont à rendre
              </div>
            </div>
            <input
              type="checkbox"
              checked={data.settings.notificationsEnabled !== false}
              onChange={(e) => updateSettings({ notificationsEnabled: e.target.checked })}
              style={{ cursor: 'pointer', transform: 'scale(1.25)' }}
            />
          </div>
        </div>

        {/* DONNÉES & SAUVEGARDE */}
        <div className="section-card" style={{ padding: '24px 28px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph-bold ph-database" style={{ color: 'var(--success)' }}></i> Sauvegarde & Données
          </h3>

          <p style={{ margin: '0 0 16px 0', fontSize: '0.86rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            Exporte ou importe l'intégralité de tes devoirs, cours, notes et réglages dans un fichier JSON sécurisé.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleExportData} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="ph-bold ph-export"></i> Exporter mes données
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleImportData} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="ph-bold ph-import"></i> Importer une sauvegarde
            </button>
          </div>
        </div>

        {/* MISES À JOUR & GESTION DES VERSIONS */}
        <div className="section-card" style={{ padding: '24px 28px', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ph-bold ph-sparkle" style={{ color: 'var(--primary)' }}></i> Mises à jour & Gestion des Versions
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Installe la dernière version disponible ou choisis une version spécifique selon tes besoins.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '5px 12px',
                  borderRadius: '10px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  color: 'var(--primary)',
                }}
              >
                Version actuelle : v{appVersion}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveModal('changelog')}>
                <i className="ph-bold ph-newspaper-clipping"></i> Journal des nouveautés
              </button>
            </div>
          </div>

          {/* PANNEAU DE SUIVI DU TÉLÉCHARGEMENT & INSTALLATION */}
          {downloadState !== 'idle' && (
            <div
              style={{
                marginBottom: '20px',
                padding: '18px 20px',
                borderRadius: '14px',
                border: '1px solid var(--border)',
                background:
                  downloadState === 'downloaded'
                    ? 'rgba(46, 213, 115, 0.08)'
                    : downloadState === 'error'
                    ? 'rgba(239, 68, 68, 0.08)'
                    : 'rgba(99, 102, 241, 0.08)',
              }}
            >
              {downloadState === 'downloading' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem' }}>
                      <i className="ph-bold ph-arrows-clockwise" style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }}></i>
                      <span>Téléchargement de {downloadTargetVersion} en cours...</span>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)' }}>
                      {downloadProgress.percent}%
                    </span>
                  </div>

                  {/* Barre de progression */}
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      borderRadius: '999px',
                      background: 'var(--bg-input)',
                      overflow: 'hidden',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(3, downloadProgress.percent)}%`,
                        height: '100%',
                        borderRadius: '999px',
                        background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                        transition: 'width 0.25s ease',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>{formatBytes(downloadProgress.receivedBytes)} / {formatBytes(downloadProgress.totalBytes)}</span>
                    <span>Installation automatique disponible dès la fin du téléchargement</span>
                  </div>
                </div>
              )}

              {downloadState === 'downloaded' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'rgba(46, 213, 115, 0.15)',
                        color: 'var(--success)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem',
                      }}
                    >
                      <i className="ph-bold ph-check"></i>
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--success)' }}>
                        Téléchargement terminé avec succès !
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                        La version <strong>{downloadTargetVersion}</strong> est prête à être installée.
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={handleInstallDownloaded}
                    style={{ background: 'var(--success)', borderColor: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <i className="ph-bold ph-rocket-launch"></i> Installer maintenant et redémarrer
                  </button>
                </div>
              )}

              {downloadState === 'installing' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                    }}
                  >
                    <i className="ph-bold ph-gear" style={{ animation: 'spin 2s linear infinite' }}></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--primary)' }}>
                      Lancement de l'installeur en cours...
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                      L'application se ferme pour appliquer la mise à jour (sans écran blanc). Elle redémarrera automatiquement une fois terminée.
                    </div>
                  </div>
                </div>
              )}

              {downloadState === 'error' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--urgent)' }}>
                    <i className="ph-bold ph-warning-circle" style={{ fontSize: '1.3rem' }}></i>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Échec de la mise à jour</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{installErrorMsg}</div>
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => setDownloadState('idle')}>
                    Fermer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DEUX COLONNES : 1. DERNIÈRE VERSION | 2. CHOIX D'UNE VERSION SPÉCIFIQUE */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* COLONNE 1 : VERSION LA PLUS RÉCENTE (Bouton conservé) */}
            <div
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <i className="ph-bold ph-rocket" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}></i>
                  <span style={{ fontWeight: 800, fontSize: '1rem' }}>Dernière version officielle</span>
                </div>
                <p style={{ margin: '0 0 16px 0', fontSize: '0.84rem', color: 'var(--text-dim)', lineHeight: 1.45 }}>
                  Vérifie rapidement si une version plus récente est disponible sur GitHub et installe-la en un clic.
                </p>

                {isLatestNewer && latestRelease && (
                  <div
                    style={{
                      marginBottom: '16px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid var(--primary)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--primary)', fontSize: '0.88rem' }}>
                      <i className="ph-bold ph-sparkle"></i> Nouvelle version trouvée : {latestRelease.tagName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {(latestRelease as ReleaseAssetInfo).publishedAt
                        ? `Sortie le ${formatDate((latestRelease as ReleaseAssetInfo).publishedAt)}`
                        : 'Prête au téléchargement'}
                    </div>
                  </div>
                )}
              </div>

              <div>
                {isLatestNewer && latestRelease ? (
                  <button
                    className="btn btn-primary w-full"
                    disabled={downloadState === 'downloading' || downloadState === 'installing'}
                    onClick={() => handleStartDownload(latestRelease)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <i className="ph-bold ph-download-simple"></i> Télécharger & Installer la {latestRelease.tagName} (Dernière)
                  </button>
                ) : (
                  <button
                    className="btn btn-primary w-full"
                    disabled={checkingUpdates || downloadState === 'downloading'}
                    onClick={handleCheckUpdates}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <i className={`ph-bold ph-arrows-clockwise ${checkingUpdates ? 'ph-spin' : ''}`}></i>
                    {checkingUpdates ? 'Vérification en cours...' : 'Vérifier la version la plus récente'}
                  </button>
                )}

                {updaterMsg && (
                  <div
                    style={{
                      marginTop: '10px',
                      fontSize: '0.82rem',
                      color: isLatestNewer ? 'var(--primary)' : 'var(--text-muted)',
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    {updaterMsg}
                  </div>
                )}
              </div>
            </div>

            {/* COLONNE 2 : SÉLECTEUR DE VERSION SPÉCIFIQUE (Le truc pour choisir la version que l'on veut) */}
            <div
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="ph-bold ph-list-dashes" style={{ color: 'var(--accent)', fontSize: '1.2rem' }}></i>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>Choisir une version spécifique</span>
                  </div>
                  <button
                    className="btn-icon"
                    title="Actualiser la liste des versions"
                    onClick={loadAllReleases}
                    disabled={loadingReleases}
                    style={{ width: '28px', height: '28px' }}
                  >
                    <i className={`ph ph-arrows-clockwise ${loadingReleases ? 'ph-spin' : ''}`} style={{ fontSize: '0.9rem' }}></i>
                  </button>
                </div>

                <p style={{ margin: '0 0 14px 0', fontSize: '0.84rem', color: 'var(--text-dim)', lineHeight: 1.45 }}>
                  Sélectionne la version de ton choix dans la liste pour rétrograder ou installer une version particulière :
                </p>

                <div style={{ marginBottom: '14px' }}>
                  <select
                    value={selectedReleaseId}
                    onChange={(e) => setSelectedReleaseId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">
                      {loadingReleases
                        ? 'Chargement des versions depuis GitHub...'
                        : allReleases.length === 0
                        ? 'Aucune version chargée'
                        : '-- Choisir une version dans la liste --'}
                    </option>
                    {allReleases.map((r) => {
                      const isCurrent = (r.tagName || '').replace(/^v\.?/, '') === appVersion.replace(/^v\.?/, '');
                      return (
                        <option key={r.id} value={r.id}>
                          {r.tagName} {r.name && r.name !== r.tagName ? `(${r.name})` : ''} — {formatDate(r.publishedAt)}
                          {isCurrent ? ' [Actuelle]' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {selectedRelease && (
                  <div
                    style={{
                      marginBottom: '14px',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>
                        {selectedRelease.tagName}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {formatDate(selectedRelease.publishedAt)}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '8px', lineHeight: 1.4 }}>
                      {selectedRelease.body
                        ? selectedRelease.body.replace(/[#*`_]/g, '').slice(0, 140) + '...'
                        : 'Aucune description disponible.'}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <i className="ph-bold ph-file"></i>
                      <span>
                        {selectedRelease.assetName
                          ? `${selectedRelease.assetName} (${formatBytes(selectedRelease.assetSize)})`
                          : 'Installeur Windows disponible'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                {selectedRelease ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      disabled={downloadState === 'downloading' || downloadState === 'installing'}
                      onClick={() => handleStartDownload(selectedRelease)}
                    >
                      <i className="ph-bold ph-download-simple"></i> Installer {selectedRelease.tagName}
                    </button>
                    {selectedRelease.htmlUrl && (
                      <button
                        className="btn btn-secondary btn-sm"
                        title="Ouvrir la page de version sur GitHub"
                        onClick={() => {
                          if (window.updater?.openExternal) {
                            window.updater.openExternal(selectedRelease.htmlUrl);
                          } else {
                            window.open(selectedRelease.htmlUrl, '_blank');
                          }
                        }}
                      >
                        <i className="ph-bold ph-arrow-square-out"></i>
                      </button>
                    )}
                  </div>
                ) : (
                  <button className="btn btn-secondary btn-sm w-full" disabled style={{ opacity: 0.6 }}>
                    <i className="ph ph-hand-pointing"></i> Sélectionne une version ci-dessus
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
