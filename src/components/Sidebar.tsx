import React from 'react';
import { useApp } from '../context/AppContext';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, data, setActiveModal, setEditingTask } = useApp();

  const pendingTasksCount = data.tasks.filter((t) => !t.completed).length;

  const navItems: NavItem[] = [
    { id: 'home', label: 'Accueil', icon: 'ph-bold ph-house' },
    { id: 'tasks', label: 'Mes Devoirs', icon: 'ph-bold ph-check-square', badge: pendingTasksCount },
    { id: 'courses', label: 'Cours & Fiches', icon: 'ph-bold ph-books' },
    { id: 'dashboard', label: 'Tableau de bord', icon: 'ph-bold ph-chart-line-up' },
    { id: 'grades', label: 'Carnet de notes', icon: 'ph-bold ph-exam' },
    { id: 'schedule', label: 'Planning', icon: 'ph-bold ph-calendar-blank' },
    { id: 'history', label: 'Archives', icon: 'ph-bold ph-archive' },
    { id: 'settings', label: 'Paramètres', icon: 'ph-bold ph-gear' },
  ];

  const initialLetter = (data.userName || 'U').charAt(0).toUpperCase();

  return (
    <nav className="sidebar" role="navigation" aria-label="Menu principal" style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid var(--border)', background: 'var(--bg-sidebar)', backdropFilter: 'blur(16px)', zIndex: 10 }}>
      <div>
        {/* LOGO & BRAND */}
        <div className="sidebar-header" style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            className="logo-box"
            aria-hidden="true"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.4rem',
              boxShadow: '0 4px 16px var(--primary-soft)',
              flexShrink: 0,
            }}
          >
            <i className="ph-bold ph-student"></i>
          </div>
          <div className="sidebar-brand">
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, var(--text), var(--text-dim))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Planner
            </h2>
            <span
              className="sidebar-version clickable"
              onClick={() => setActiveModal('changelog')}
              title="Voir le Journal des nouveautés (Update Log)"
              style={{
                fontSize: '0.75rem',
                cursor: 'pointer',
                color: 'var(--primary)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '2px',
              }}
            >
              v2.5.6 <i className="ph-bold ph-sparkle"></i>
            </span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <ul className="nav-menu" role="list" style={{ listStyle: 'none', padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                role="listitem"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.92rem',
                  color: isActive ? 'var(--text)' : 'var(--text-dim)',
                  background: isActive ? 'var(--bg-active-nav)' : 'transparent',
                  border: isActive ? '1px solid var(--border-active)' : '1px solid transparent',
                  transition: 'all 0.18s var(--ease-out-expo)',
                }}
              >
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      left: '-4px',
                      top: '25%',
                      bottom: '25%',
                      width: '4px',
                      borderRadius: '4px',
                      background: 'var(--primary)',
                      boxShadow: '0 0 10px var(--primary)',
                    }}
                  />
                )}
                <i
                  className={item.icon}
                  aria-hidden="true"
                  style={{
                    fontSize: '1.2rem',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'color 0.18s ease',
                  }}
                ></i>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: isActive ? 'var(--primary)' : 'var(--primary-soft)',
                      color: isActive ? '#fff' : 'var(--primary)',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* FOOTER & PROFILE */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <button
          className="btn btn-primary w-full"
          onClick={() => {
            setEditingTask(null);
            setActiveModal('task');
          }}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '12px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <i className="ph-bold ph-plus"></i>
          <span>Nouveau devoir</span>
        </button>

        <div
          className="user-profile"
          title="Ouvrir les paramètres du profil"
          onClick={() => setActiveTab('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '12px',
            cursor: 'pointer',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            transition: 'border-color 0.2s ease',
          }}
        >
          <div
            className="avatar"
            aria-hidden="true"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: '#fff',
              fontSize: '0.95rem',
              flexShrink: 0,
            }}
          >
            {initialLetter}
          </div>
          <div className="user-info" style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {data.userName || 'Utilisateur'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--success)',
                  boxShadow: '0 0 6px var(--success)',
                }}
              ></span>
              <span>En ligne</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
