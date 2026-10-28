import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getLocalDateString, parseLocalDate } from '../utils/date';

export const HomeView: React.FC = () => {
  const { data, setActiveTab, toggleTask, setActiveModal, setEditingTask } = useApp();

  // Son de complétion gratifiant
  const playXpSound = () => {
    try {
      const audio = new Audio('assets/minecraft_xp.mp3');
      audio.volume = 0.35;
      audio.play().catch(() => {});
    } catch (_) {}
  };

  const handleToggleTask = (id: string | number) => {
    const task = data.tasks.find((t) => t.id === id);
    if (task && !task.completed) {
      playXpSound();
    }
    toggleTask(id);
  };

  // Salutation dynamique
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Bonjour', icon: '☀️' };
    if (hour >= 12 && hour < 18) return { text: 'Bon après-midi', icon: '🌤️' };
    return { text: 'Bonsoir', icon: '🌙' };
  }, []);

  // Devoirs non complétés
  const pendingTasks = useMemo(() => {
    return data.tasks.filter((t) => !t.completed);
  }, [data.tasks]);

  // Devoirs urgents (priorité haute ou échéance sous 24-48h)
  const urgentTasks = useMemo(() => {
    const todayStr = getLocalDateString();
    const todayMidnight = parseLocalDate(todayStr);

    return pendingTasks.filter((t) => {
      if (t.priority === 'high') return true;
      if (t.dueDate) {
        const targetMidnight = parseLocalDate(t.dueDate);
        const diffDays = Math.round((targetMidnight - todayMidnight) / (1000 * 3600 * 24));
        return diffDays <= 1;
      }
      return false;
    });
  }, [pendingTasks]);

  // Moyenne générale pondérée
  const overallAverage = useMemo(() => {
    if (!data.grades || data.grades.length === 0) return null;
    let totalPoints = 0;
    let totalCoef = 0;
    for (const g of data.grades) {
      const coef = g.weight || 1;
      const val = (g.value / (g.max || 20)) * 20;
      totalPoints += val * coef;
      totalCoef += coef;
    }
    return totalCoef > 0 ? (totalPoints / totalCoef).toFixed(2) : null;
  }, [data.grades]);

  // Total des fiches de cours
  const totalCoursesCount = useMemo(() => {
    return data.coursesList.reduce((acc, s) => acc + (s.courses?.length || 0), 0);
  }, [data.coursesList]);

  // Jour actuel en français
  const todayDayName = useMemo(() => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    return days[new Date().getDay()];
  }, []);

  // Devoirs du jour
  const todayStr = useMemo(() => getLocalDateString(), []);
  const tasksDueToday = useMemo(() => {
    return data.tasks.filter((t) => t.dueDate === todayStr);
  }, [data.tasks, todayStr]);

  const tasksDueTodayCompleted = useMemo(() => {
    return tasksDueToday.filter((t) => t.completed).length;
  }, [tasksDueToday]);

  const completionRate = tasksDueToday.length > 0
    ? Math.round((tasksDueTodayCompleted / tasksDueToday.length) * 100)
    : 100;

  return (
    <div className="tab-pane active" id="tab-home" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* BANNIÈRE HERO DE BIENVENUE */}
      <div
        className="section-card"
        style={{
          padding: '28px 32px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.7))',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: 'var(--primary-soft)', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '12px' }}>
            <span>{greeting.icon}</span>
            <span>{greeting.text}</span>
          </div>

          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>
            {greeting.text}, {data.userName || 'Baptiste'} !
          </h1>

          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            {pendingTasks.length === 0
              ? '✨ Aucun devoir en attente pour le moment ! Profite de ta journée ou révise tes fiches.'
              : (
                <>
                  Tu as {pendingTasks.length} devoir{pendingTasks.length > 1 ? 's' : ''} à faire, dont{' '}
                  <b style={{ color: urgentTasks.length > 0 ? 'var(--urgent)' : 'var(--success)' }}>
                    {urgentTasks.length} urgent{urgentTasks.length > 1 ? 's' : ''}
                  </b>
                  . Organise ton temps pour rester serein.
                </>
              )
            }
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingTask(null);
              setActiveModal('task');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', fontWeight: 600 }}
          >
            <i className="ph-bold ph-plus"></i>
            <span>Nouveau devoir</span>
          </button>
        </div>
      </div>

      {/* CARTES STATISTIQUES AVEC EFFET GLASS */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="stat-card" onClick={() => setActiveTab('tasks')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon stat-icon--tasks" style={{ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-soft)', color: 'var(--primary)', fontSize: '1.4rem' }}>
            <i className="ph-bold ph-check-square"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value" style={{ fontSize: '1.6rem', fontWeight: 700 }}>{pendingTasks.length}</span>
            <span className="stat-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Devoirs en cours</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('tasks')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon stat-icon--urgent" style={{ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--urgent-soft)', color: 'var(--urgent)', fontSize: '1.4rem' }}>
            <i className="ph-bold ph-warning-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value" style={{ fontSize: '1.6rem', fontWeight: 700, color: urgentTasks.length > 0 ? 'var(--urgent)' : undefined }}>
              {urgentTasks.length}
            </span>
            <span className="stat-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Devoirs urgents</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('grades')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon stat-icon--grades" style={{ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(192, 132, 252, 0.15)', color: 'var(--accent)', fontSize: '1.4rem' }}>
            <i className="ph-bold ph-exam"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value" style={{ fontSize: '1.6rem', fontWeight: 700 }}>
              {overallAverage !== null ? `${overallAverage}` : '--'}
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/20</span>
            </span>
            <span className="stat-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Moyenne générale</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('courses')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon stat-icon--courses" style={{ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--success-soft)', color: 'var(--success)', fontSize: '1.4rem' }}>
            <i className="ph-bold ph-books"></i>
          </div>
          <div className="stat-content">
            <span className="stat-value" style={{ fontSize: '1.6rem', fontWeight: 700 }}>{totalCoursesCount}</span>
            <span className="stat-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fiches de cours</span>
          </div>
        </div>
      </div>

      {/* PROGRAMME DU JOUR */}
      <div className="section-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
              <i className="ph-bold ph-calendar-check"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Programme du Jour • {todayDayName}</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {tasksDueToday.length} devoir{tasksDueToday.length > 1 ? 's' : ''} prévu{tasksDueToday.length > 1 ? 's' : ''} aujourd'hui
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>{completionRate}%</span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>complété</div>
            </div>
          </div>
        </div>

        {/* Barre de progression avec lueur */}
        <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden', marginBottom: '18px' }}>
          <div
            style={{
              height: '100%',
              width: `${completionRate}%`,
              background: 'linear-gradient(90deg, var(--primary), var(--accent))',
              borderRadius: '999px',
              transition: 'width 0.4s var(--ease-out-expo)',
              boxShadow: '0 0 10px var(--primary-soft)',
            }}
          />
        </div>

        {tasksDueToday.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasksDueToday.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--bg-input)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  transition: 'all 0.18s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                  />
                  <div>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        opacity: task.completed ? 0.6 : 1,
                      }}
                    >
                      {task.title}
                    </span>
                    <span
                      style={{
                        marginLeft: '10px',
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'var(--bg-card)',
                        color: 'var(--text-dim)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {task.subject}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: task.priority === 'high' ? 'var(--urgent)' : 'var(--text-muted)',
                  }}
                >
                  {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Normal' : 'Basse'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            ✨ Aucun devoir prévu pour aujourd'hui ! Profite de ton temps libre ou prends de l'avance.
          </div>
        )}
      </div>

      {/* SPLIT : DEVOIRS URGENTS & RACCOURCIS COURS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Devoirs urgents */}
        <div className="section-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="ph-bold ph-clock-countdown" style={{ color: 'var(--urgent)' }}></i>
              <span>Devoirs urgents & à venir</span>
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('tasks')}>
              Voir tout ({pendingTasks.length})
            </button>
          </div>

          {urgentTasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {urgentTasks.slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => handleToggleTask(t.id)}
                      style={{ cursor: 'pointer', transform: 'scale(1.15)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{t.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {t.subject} • Échéance : {t.dueDate || 'Non définie'}
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn-icon"
                    onClick={() => {
                      setEditingTask(t);
                      setActiveModal('task');
                    }}
                    title="Modifier"
                  >
                    <i className="ph ph-pencil-simple"></i>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)' }}>
              <i className="ph-duotone ph-check-circle" style={{ fontSize: '2.5rem', color: 'var(--success)', marginBottom: '8px' }}></i>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Tous les devoirs urgents sont terminés !</p>
            </div>
          )}
        </div>

        {/* Raccourcis de cours */}
        <div className="section-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="ph-bold ph-book-open" style={{ color: 'var(--primary)' }}></i>
              <span>Matières & Fiches de Révision</span>
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('courses')}>
              Toutes les matières
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '10px' }}>
            {data.coursesList.slice(0, 6).map((sub) => (
              <div
                key={sub.id}
                onClick={() => setActiveTab('courses')}
                style={{
                  padding: '16px 12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '1.6rem', marginBottom: '6px', color: 'var(--primary)' }}>
                  <i className="ph-bold ph-folder"></i>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{sub.subject}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {sub.courses?.length || 0} document{sub.courses?.length > 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
