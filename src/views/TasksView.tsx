import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Task, Priority } from '../types';
import { getLocalDateString, parseLocalDate, getRelativeDateInfo } from '../utils/date';

export const TasksView: React.FC = () => {
  const { data, toggleTask, deleteTask, setEditingTask, setActiveModal, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'today' | 'week' | 'overdue' | 'completed'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'priority' | 'subject'>('date-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Son de complétion
  const playXpSound = () => {
    try {
      const audio = new Audio('assets/minecraft_xp.mp3');
      audio.volume = 0.35;
      audio.play().catch(() => {});
    } catch (_) {}
  };

  const handleToggleTask = (task: Task) => {
    if (!task.completed) {
      playXpSound();
    }
    toggleTask(task.id);
  };

  // Matières disponibles
  const subjects = useMemo(() => {
    const set = new Set<string>();
    data.tasks.forEach((t) => {
      if (t.subject) set.add(t.subject);
    });
    data.coursesList.forEach((s) => {
      if (s.subject) set.add(s.subject);
    });
    return Array.from(set).sort();
  }, [data.tasks, data.coursesList]);

  // Statistiques de filtres
  const stats = useMemo(() => {
    const todayStr = getLocalDateString();
    const todayTime = parseLocalDate(todayStr);
    const weekLaterTime = todayTime + 7 * 24 * 3600 * 1000;

    const all = data.tasks.length;
    const completed = data.tasks.filter((t) => t.completed).length;
    const todayCount = data.tasks.filter((t) => !t.completed && t.dueDate === todayStr).length;
    const weekCount = data.tasks.filter((t) => {
      if (t.completed || !t.dueDate) return false;
      const time = parseLocalDate(t.dueDate);
      return time >= todayTime && time <= weekLaterTime;
    }).length;
    const overdueCount = data.tasks.filter((t) => {
      if (t.completed || !t.dueDate) return false;
      return parseLocalDate(t.dueDate) < todayTime;
    }).length;

    return { all, completed, todayCount, weekCount, overdueCount };
  }, [data.tasks]);

  // Filtrage et Tri
  const filteredTasks = useMemo(() => {
    const todayStr = getLocalDateString();
    const todayTime = parseLocalDate(todayStr);
    const weekLaterTime = todayTime + 7 * 24 * 3600 * 1000;

    return data.tasks
      .filter((task) => {
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchSubj = task.subject?.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchSubj && !matchDesc) return false;
        }

        if (selectedSubject !== 'all' && task.subject !== selectedSubject) {
          return false;
        }

        if (filterStatus === 'completed') return task.completed;
        if (filterStatus === 'all') return true;

        if (task.completed) return false;

        const taskTime = parseLocalDate(task.dueDate);

        if (filterStatus === 'today') {
          return task.dueDate === todayStr;
        }
        if (filterStatus === 'week') {
          return taskTime >= todayTime && taskTime <= weekLaterTime;
        }
        if (filterStatus === 'overdue') {
          return !!task.dueDate && taskTime > 0 && taskTime < todayTime;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-asc') {
          const tA = a.dueDate ? parseLocalDate(a.dueDate) : Infinity;
          const tB = b.dueDate ? parseLocalDate(b.dueDate) : Infinity;
          return tA - tB;
        }
        if (sortBy === 'date-desc') {
          const tA = a.dueDate ? parseLocalDate(a.dueDate) : 0;
          const tB = b.dueDate ? parseLocalDate(b.dueDate) : 0;
          return tB - tA;
        }
        if (sortBy === 'priority') {
          const pOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
          return (pOrder[b.priority] || 1) - (pOrder[a.priority] || 1);
        }
        if (sortBy === 'subject') {
          return (a.subject || '').localeCompare(b.subject || '');
        }
        return 0;
      });
  }, [data.tasks, searchTerm, filterStatus, selectedSubject, sortBy]);

  const handleOpenAttachment = async (path?: string) => {
    if (!path) return;
    if (window.storage?.openAttachment) {
      const ok = await window.storage.openAttachment(path);
      if (!ok) showToast('Impossible d’ouvrir le fichier joint', 'error');
    }
  };

  const getRelativeDateLabel = (dateStr?: string) => {
    return getRelativeDateInfo(dateStr);
  };


  return (
    <div className="tab-pane active" id="tab-tasks" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* BARRE D'ACTIONS ET FILTRES */}
      <div
        className="section-card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Recherche */}
        <div className="search-bar" style={{ flex: '1 1 240px', minWidth: '220px' }}>
          <i className="ph ph-magnifying-glass search-icon" aria-hidden="true"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher par titre, matière, consigne..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="btn-icon" onClick={() => setSearchTerm('')} style={{ marginRight: '4px' }}>
              <i className="ph ph-x"></i>
            </button>
          )}
        </div>

        {/* Matières */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          style={{
            padding: '9px 14px',
            borderRadius: '10px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            fontSize: '0.88rem',
            cursor: 'pointer',
          }}
        >
          <option value="all">Toutes les matières</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Tri */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          style={{
            padding: '9px 14px',
            borderRadius: '10px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            fontSize: '0.88rem',
            cursor: 'pointer',
          }}
        >
          <option value="date-asc">Échéance la plus proche</option>
          <option value="date-desc">Échéance la plus éloignée</option>
          <option value="priority">Priorité haute d'abord</option>
          <option value="subject">Matière (A - Z)</option>
        </select>

        {/* Vue Grille / Liste */}
        <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: '10px', padding: '3px', border: '1px solid var(--border)' }}>
          <button
            className="btn-icon"
            onClick={() => setViewMode('grid')}
            title="Vue en grille"
            style={{
              background: viewMode === 'grid' ? 'var(--bg-card)' : 'transparent',
              color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
              borderRadius: '8px',
              padding: '6px 10px',
            }}
          >
            <i className="ph-bold ph-squares-four"></i>
          </button>
          <button
            className="btn-icon"
            onClick={() => setViewMode('list')}
            title="Vue en liste compacte"
            style={{
              background: viewMode === 'list' ? 'var(--bg-card)' : 'transparent',
              color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)',
              borderRadius: '8px',
              padding: '6px 10px',
            }}
          >
            <i className="ph-bold ph-list-dashes"></i>
          </button>
        </div>

        {/* Bouton Ajouter */}
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingTask(null);
            setActiveModal('task');
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.88rem' }}
        >
          <i className="ph-bold ph-plus"></i>
          <span>Nouveau devoir</span>
        </button>
      </div>

      {/* CHIPS DE FILTRES AVEC COMPTEURS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'Tous', count: stats.all },
          { key: 'today', label: "Aujourd'hui", count: stats.todayCount },
          { key: 'week', label: 'Cette semaine', count: stats.weekCount },
          { key: 'overdue', label: 'En retard', count: stats.overdueCount, isUrgent: true },
          { key: 'completed', label: 'Terminés', count: stats.completed },
        ].map((f) => {
          const isActive = filterStatus === f.key;
          return (
            <button
              key={f.key}
              className={`chip ${isActive ? 'active' : ''}`}
              onClick={() => setFilterStatus(f.key as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                borderRadius: '999px',
                border: isActive ? '1px solid var(--primary)' : '1px solid var(--border)',
                background: isActive ? 'var(--primary)' : 'var(--bg-card)',
                color: isActive ? '#fff' : 'var(--text)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              <span>{f.label}</span>
              <span
                style={{
                  padding: '1px 7px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-input)',
                  color: f.isUrgent && f.count > 0 && !isActive ? 'var(--urgent)' : 'inherit',
                  fontWeight: 700,
                }}
              >
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* AFFICHAGE DES DEVOIRS : GRILLE OU LISTE */}
      {filteredTasks.length > 0 ? (
        viewMode === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '16px' }}>
            {filteredTasks.map((task) => {
              const relDate = getRelativeDateLabel(task.dueDate);

              return (
                <div
                  key={task.id}
                  className={`task-card section-card ${task.completed ? 'completed' : ''}`}
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    borderColor: relDate.isOverdue && !task.completed ? 'var(--urgent)' : undefined,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task)}
                          style={{ cursor: 'pointer', transform: 'scale(1.25)' }}
                          title="Cocher / Décocher"
                        />
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            padding: '3px 9px',
                            borderRadius: '8px',
                            background: 'var(--primary-soft)',
                            color: 'var(--primary)',
                            border: '1px solid var(--border-active)',
                          }}
                        >
                          {task.subject}
                        </span>
                      </div>

                      {/* Indicateur de priorité avec point lumineux */}
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background:
                            task.priority === 'high'
                              ? 'var(--urgent-soft)'
                              : task.priority === 'medium'
                              ? 'rgba(251, 191, 36, 0.15)'
                              : 'var(--success-soft)',
                          color:
                            task.priority === 'high'
                              ? 'var(--urgent)'
                              : task.priority === 'medium'
                              ? 'var(--warning)'
                              : 'var(--success)',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: 'currentColor',
                            boxShadow: task.priority === 'high' ? '0 0 6px var(--urgent)' : undefined,
                          }}
                        />
                        {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Normale' : 'Basse'}
                      </span>
                    </div>

                    <h3
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '1.08rem',
                        fontWeight: 700,
                        textDecoration: task.completed ? 'line-through' : 'none',
                        opacity: task.completed ? 0.6 : 1,
                        lineHeight: 1.35,
                      }}
                    >
                      {task.title}
                    </h3>

                    {task.description && (
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.86rem', color: 'var(--text-dim)', lineHeight: 1.45 }}>
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* PIED DE CARTE */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        color: relDate.isOverdue && !task.completed ? 'var(--urgent)' : relDate.isToday && !task.completed ? 'var(--warning)' : 'var(--text-muted)',
                        fontWeight: 600,
                      }}
                    >
                      <i className="ph-bold ph-calendar"></i>
                      <span>{relDate.text} ({task.dueDate || 'Sans date'})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {task.attachment && (
                        <button
                          className="btn-icon"
                          onClick={() => handleOpenAttachment(task.attachment)}
                          title="Ouvrir le fichier joint"
                          style={{ color: 'var(--accent)' }}
                        >
                          <i className="ph-bold ph-paperclip"></i>
                        </button>
                      )}
                      <button
                        className="btn-icon"
                        onClick={() => {
                          setEditingTask(task);
                          setActiveModal('task');
                        }}
                        title="Modifier le devoir"
                      >
                        <i className="ph-bold ph-pencil-simple"></i>
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => deleteTask(task.id)}
                        title="Supprimer définitivement"
                        style={{ color: 'var(--urgent)' }}
                      >
                        <i className="ph-bold ph-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* VUE LISTE COMPACTE */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredTasks.map((task) => {
              const relDate = getRelativeDateLabel(task.dueDate);

              return (
                <div
                  key={task.id}
                  className={`task-card section-card ${task.completed ? 'completed' : ''}`}
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    borderColor: relDate.isOverdue && !task.completed ? 'var(--urgent)' : undefined,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task)}
                      style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: '0.96rem',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            opacity: task.completed ? 0.6 : 1,
                          }}
                        >
                          {task.title}
                        </span>
                        <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px', background: 'var(--primary-soft)', color: 'var(--primary)', fontWeight: 600 }}>
                          {task.subject}
                        </span>
                      </div>
                      {task.description && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{task.description}</div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: relDate.isOverdue && !task.completed ? 'var(--urgent)' : 'var(--text-muted)',
                      }}
                    >
                      {relDate.text}
                    </span>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        className="btn-icon"
                        onClick={() => {
                          setEditingTask(task);
                          setActiveModal('task');
                        }}
                        title="Modifier"
                      >
                        <i className="ph-bold ph-pencil-simple"></i>
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => deleteTask(task.id)}
                        title="Supprimer"
                        style={{ color: 'var(--urgent)' }}
                      >
                        <i className="ph-bold ph-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="section-card" style={{ textAlign: 'center', padding: '70px 20px', color: 'var(--text-muted)' }}>
          <i className="ph-duotone ph-clipboard-text" style={{ fontSize: '3.5rem', color: 'var(--primary)', marginBottom: '14px' }}></i>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--text)' }}>Aucun devoir trouvé</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem' }}>
            Aucun devoir ne correspond à tes filtres de recherche.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingTask(null);
              setActiveModal('task');
            }}
          >
            <i className="ph-bold ph-plus"></i> Créer un nouveau devoir
          </button>
        </div>
      )}
    </div>
  );
};
