import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const HistoryView: React.FC = () => {
  const { data, toggleTask, deleteTask } = useApp();

  const completedTasks = useMemo(() => {
    return data.tasks.filter((t) => t.completed);
  }, [data.tasks]);

  return (
    <div className="tab-pane active" id="tab-history">
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Archives des Devoirs</h2>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Historique de tous les devoirs terminés ({completedTasks.length})
        </p>
      </div>

      {completedTasks.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {completedTasks.map((task) => (
            <div
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                opacity: 0.85,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                  title="Marquer comme non terminé"
                />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', textDecoration: 'line-through' }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {task.subject} • Échéance : {task.dueDate || 'Non définie'}
                  </div>
                </div>
              </div>

              <button
                className="btn-icon"
                onClick={() => deleteTask(task.id)}
                title="Supprimer définitivement"
                style={{ color: 'var(--urgent)' }}
              >
                <i className="ph ph-trash"></i>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <i className="ph-duotone ph-archive" style={{ fontSize: '3rem', marginBottom: '12px' }}></i>
          <h3>Aucun devoir archivé</h3>
          <p>Les devoirs que tu coches comme terminés apparaîtront ici.</p>
        </div>
      )}
    </div>
  );
};
