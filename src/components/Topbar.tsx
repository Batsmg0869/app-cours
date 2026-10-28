import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';

export const Topbar: React.FC = () => {
  const { activeTab, setActiveModal, setEditingTask, saveData, showToast, searchQuery, setSearchQuery } = useApp();
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const tabInfo: Record<string, { label: string; icon: string }> = {
    home: { label: 'Accueil', icon: 'ph-bold ph-house' },
    tasks: { label: 'Mes Devoirs', icon: 'ph-bold ph-check-square' },
    courses: { label: 'Cours & Fiches', icon: 'ph-bold ph-books' },
    dashboard: { label: 'Tableau de bord', icon: 'ph-bold ph-chart-line-up' },
    grades: { label: 'Carnet de notes', icon: 'ph-bold ph-exam' },
    schedule: { label: 'Planning', icon: 'ph-bold ph-calendar-blank' },
    history: { label: 'Archives', icon: 'ph-bold ph-archive' },
    settings: { label: 'Paramètres', icon: 'ph-bold ph-gear' },
  };

  const currentInfo = tabInfo[activeTab] || { label: 'Accueil', icon: 'ph-bold ph-house' };

  const formattedDate = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const str = new Date().toLocaleDateString('fr-FR', options);
    return str.charAt(0).toUpperCase() + str.slice(1);
  }, []);

  const handleQuickAdd = () => {
    setEditingTask(null);
    setActiveModal('task');
  };

  const handleManualSave = async () => {
    const ok = await saveData();
    if (ok) {
      setIsSavedRecently(true);
      showToast('Toutes les modifications sont enregistrées !', 'success');
      setTimeout(() => setIsSavedRecently(false), 2000);
    }
  };

  return (
    <header
      className="topbar"
      role="banner"
      style={{
        height: '68px',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        zIndex: 5,
        gap: '20px',
      }}
    >
      {/* GAUCHE : BREADCRUMB */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '10px',
            background: 'var(--primary-soft)',
            color: 'var(--primary)',
            fontWeight: 700,
            fontSize: '0.92rem',
          }}
        >
          <i className={currentInfo.icon} aria-hidden="true" style={{ fontSize: '1.1rem' }}></i>
          <span>{currentInfo.label}</span>
        </div>
      </div>

      {/* CENTRE : DATE DU JOUR EN FORMAT PILL */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-dim)', fontSize: '0.88rem' }}>
        <i className="ph-bold ph-calendar" style={{ color: 'var(--primary)' }}></i>
        <span style={{ fontWeight: 500 }}>{formattedDate}</span>
      </div>

      {/* DROITE : RECHERCHE RAPIDE & ACTIONS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className="btn btn-primary"
          onClick={handleQuickAdd}
          title="Ajouter un nouveau devoir"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '0.88rem',
          }}
        >
          <i className="ph-bold ph-plus" aria-hidden="true"></i>
          <span>Nouveau devoir</span>
        </button>

        <button
          className="btn btn-secondary"
          onClick={handleManualSave}
          title="Enregistrer manuellement"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            padding: 0,
            color: isSavedRecently ? 'var(--success)' : 'var(--text)',
            borderColor: isSavedRecently ? 'var(--success)' : undefined,
          }}
        >
          <i className={isSavedRecently ? 'ph-bold ph-check' : 'ph ph-floppy-disk'} aria-hidden="true"></i>
        </button>
      </div>
    </header>
  );
};
