import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ScheduleView: React.FC = () => {
  const { data, showToast } = useApp();
  const [selectedWeek, setSelectedWeek] = useState<'A' | 'B'>('A');

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const hours = ['08h00', '09h00', '10h00', '11h00', '13h30', '14h30', '15h30', '16h30'];

  return (
    <div className="tab-pane active" id="tab-schedule">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Planning Hebdomadaire</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Consulte et organise ton emploi du temps par semaine
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={async () => {
              if (!window.storage?.exportICS) return;
              const events = data.tasks
                .filter((t) => t.dueDate)
                .map((t) => {
                  const [y, m, d] = t.dueDate.split('-').map(Number);
                  return {
                    title: `[${t.subject}] ${t.title}`,
                    description: t.description || '',
                    start: [y, m, d, 9, 0],
                    duration: { hours: 1 },
                  };
                });

              if (events.length === 0) {
                showToast('Aucun devoir avec date à exporter dans le calendrier', 'info');
                return;
              }

              const res: any = await window.storage.exportICS(events);
              if (res && res.success) {
                showToast('Calendrier ICS exporté avec succès !', 'success');
              }
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="ph-bold ph-calendar-plus"></i>
            <span>Exporter mes devoirs (ICS)</span>
          </button>

          <button
            className={`chip ${selectedWeek === 'A' ? 'active' : ''}`}
            onClick={() => setSelectedWeek('A')}
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              border: '1px solid var(--border)',
              background: selectedWeek === 'A' ? 'var(--primary)' : 'var(--bg-card)',
              color: selectedWeek === 'A' ? '#fff' : 'var(--text)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Semaine A
          </button>
          <button
            className={`chip ${selectedWeek === 'B' ? 'active' : ''}`}
            onClick={() => setSelectedWeek('B')}
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              border: '1px solid var(--border)',
              background: selectedWeek === 'B' ? 'var(--primary)' : 'var(--bg-card)',
              color: selectedWeek === 'B' ? '#fff' : 'var(--text)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Semaine B
          </button>
        </div>
      </div>

      <div
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '12px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.85rem',
          color: 'var(--text)',
        }}
      >
        <i className="ph-bold ph-info" style={{ color: 'var(--urgent)', fontSize: '1.2rem' }}></i>
        <span>
          <b>Information Importation ICS :</b> Le module d'import de calendrier scolaire est actuellement en cours de finalisation.
        </span>
      </div>

      {/* GRILLE DU PLANNING */}
      <div
        className="schedule-grid-wrap"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '16px',
          overflowX: 'auto',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(5, 1fr)', gap: '8px', minWidth: '650px' }}>
          {/* Header row */}
          <div style={{ fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', padding: '8px' }}>Heure</div>
          {days.map((day) => (
            <div
              key={day}
              style={{
                fontWeight: 600,
                textAlign: 'center',
                padding: '8px',
                background: 'var(--bg-main)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
              }}
            >
              {day}
            </div>
          ))}

          {/* Time slots */}
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTop: '1px dashed var(--border)',
                }}
              >
                {hour}
              </div>
              {days.map((day) => (
                <div
                  key={`${day}-${hour}`}
                  style={{
                    height: '52px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-input)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    color: 'var(--text-dim)',
                  }}
                >
                  {/* Créneaux types */}
                  {day === 'Lundi' && hour === '08h00' && (
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Mathématiques</span>
                  )}
                  {day === 'Mardi' && hour === '09h00' && (
                    <span style={{ fontWeight: 600, color: 'var(--accent)' }}>Physique-Chimie</span>
                  )}
                  {day === 'Jeudi' && hour === '10h00' && (
                    <span style={{ fontWeight: 600, color: 'var(--warning)' }}>Histoire-Géo</span>
                  )}
                  {day === 'Vendredi' && hour === '13h30' && (
                    <span style={{ fontWeight: 600, color: 'var(--success)' }}>Français</span>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
