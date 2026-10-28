import React from 'react';
import { useApp } from '../../context/AppContext';

export const ChangelogModal: React.FC = () => {
  const { activeModal, setActiveModal } = useApp();

  if (activeModal !== 'changelog') return null;

  const versions = [
    {
      version: 'v2.5.6 (Actuelle)',
      badge: 'Gestionnaire de Mises à Jour & Correctifs',
      badgeColor: 'var(--primary)',
      items: [
        {
          title: 'Sélecteur de version personnalisée',
          desc: 'Possibilité de choisir et d’installer n’importe quelle version publiée sur GitHub directement depuis les paramètres, tout en conservant le bouton d’accès rapide vers la version la plus récente.',
          icon: 'ph-bold ph-list-dashes',
          color: 'var(--primary)',
        },
        {
          title: 'Correction de la fenêtre blanche lors de l’installation',
          desc: 'Prise en charge native des événements du programme d’installation Squirrel.Windows et affichage masqué jusqu’à ce que le rendu soit prêt : suppression définitive de l’écran blanc lors des installations et lancements.',
          icon: 'ph-bold ph-shield-check',
          color: 'var(--success)',
        },
        {
          title: 'Suivi de progression en temps réel',
          desc: 'Barre de progression animée, décompte précis des mégaoctets et notification claire de fin de téléchargement et d’installation.',
          icon: 'ph-bold ph-download-simple',
          color: 'var(--accent)',
        },
      ],
    },
    {
      version: 'v2.5.5',
      badge: 'Architecture Moderne',
      badgeColor: 'var(--accent)',
      items: [
        {
          title: 'Migration complète vers React 18 + TypeScript + Vite',
          desc: 'Refonte modulaire de toute la couche UI : composants déclaratifs, typage statique strict et temps de chargement instantané avec Vite.',
          icon: 'ph-bold ph-code',
          color: 'var(--primary)',
        },
        {
          title: 'Performances GPU et Réactivité Décuplée',
          desc: 'Gestion d’état optimisée avec debouncing automatique et rafraîchissements ciblés du Virtual DOM.',
          icon: 'ph-bold ph-lightning',
          color: 'var(--accent)',
        },
      ],
    },
    {
      version: 'v2.5.0',
      badge: 'Optimisations Performances',
      badgeColor: 'var(--success)',
      items: [
        {
          title: 'I/O Asynchrones & Sauvegarde Atomique',
          desc: 'Toutes les opérations disque (sauvegarde data.json, copies PDF, téléchargements) sont désormais 100% non-bloquantes.',
          icon: 'ph-bold ph-hard-drives',
          color: 'var(--success)',
        },
        {
          title: 'Optimisation de la Visionneuse PDF',
          desc: 'Nettoyage automatique de la mémoire RAM et GPU lors de la fermeture des documents.',
          icon: 'ph-bold ph-file-pdf',
          color: 'var(--warning)',
        },
      ],
    },
    {
      version: 'v2.4.0',
      badge: 'Système & Mise à jour',
      badgeColor: 'var(--warning)',
      items: [
        {
          title: 'Affichage du Programme du Jour sur l’Accueil',
          desc: 'Aperçu immédiat des devoirs à rendre et barre de progression dynamique.',
          icon: 'ph-bold ph-calendar-check',
          color: 'var(--primary)',
        },
        {
          title: 'Gestion par Trimestres & Simulateur de Notes',
          desc: 'Découpe par période (T1, T2, T3) avec calculs pondérés et anticipation de la note requise pour atteindre son objectif.',
          icon: 'ph-bold ph-calculator',
          color: 'var(--accent)',
        },
        {
          title: 'Notifications de Rappel Intelligentes',
          desc: 'Alertes discrètes sous 24h, aucun parasite si aucun devoir n’est prévu.',
          icon: 'ph-bold ph-bell-ringing',
          color: 'var(--urgent)',
        },
      ],
    },
  ];

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        className="modal-card"
        style={{
          background: 'var(--bg-main)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--primary-soft)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <i className="ph-bold ph-sparkle" style={{ fontSize: '1.2rem' }}></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Journal des Nouveautés</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Historique des versions</p>
            </div>
          </div>
          <button className="btn-icon" onClick={() => setActiveModal(null)}>
            <i className="ph ph-x"></i>
          </button>
        </div>

        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {versions.map((ver) => (
            <div key={ver.version}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{ver.version}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: ver.badgeColor,
                    fontWeight: 600,
                  }}
                >
                  {ver.badge}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ver.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ color: item.color, fontSize: '1.2rem', marginTop: '2px' }}>
                      <i className={item.icon}></i>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '3px' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-card)' }}>
          <button className="btn btn-primary" onClick={() => setActiveModal(null)}>
            <i className="ph-bold ph-check"></i> Compris !
          </button>
        </div>
      </div>
    </div>
  );
};
