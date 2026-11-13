import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TimetableSlot } from '../types';
import { SlotModal } from '../components/modals/SlotModal';

type ModalState = {
  slot?: TimetableSlot;
  defaultDay?: string;
  defaultHour?: string;
} | null;

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'] as const;

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 7; h < 18; h++) {
    slots.push(`${String(h).padStart(2, '0')}:30`);
    slots.push(`${String(h + 1).padStart(2, '0')}:00`);
  }
  // Start from 07:30 to 18:00
  return slots;
}

// 07:30, 08:00, 08:30, ... 18:00
function buildTimeRows(): string[] {
  const rows: string[] = [];
  for (let h = 7; h <= 18; h++) {
    if (h === 7) {
      rows.push('07:30');
    } else if (h === 18) {
      rows.push('18:00');
    } else {
      rows.push(`${String(h).padStart(2, '0')}:00`);
      rows.push(`${String(h).padStart(2, '0')}:30`);
    }
  }
  return rows;
}

const TIME_ROWS = buildTimeRows();

function slotMatchesCell(slot: TimetableSlot, day: string, hour: string, selectedWeek: 'A' | 'B'): boolean {
  if (slot.day !== day) return false;
  if (slot.startTime !== hour) return false;
  const w = slot.week ?? 'AB';
  if (selectedWeek === 'A') return w === 'A' || w === 'AB';
  return w === 'B' || w === 'AB';
}

export const ScheduleView: React.FC = () => {
  const { data, showToast } = useApp();
  const [selectedWeek, setSelectedWeek] = useState<'A' | 'B'>('A');
  const [slotModal, setSlotModal] = useState<ModalState>(null);

  const timetable = data.timetable ?? [];

  const headerChipStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 16px',
    borderRadius: '999px',
    border: '1px solid var(--border)',
    background: active ? 'var(--primary)' : 'var(--bg-card)',
    color: active ? '#fff' : 'var(--text)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
  });

  return (
    <div className="tab-pane active" id="tab-schedule">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Emploi du temps</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Consulte et modifie ton emploi du temps
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Week toggles */}
          <button style={headerChipStyle(selectedWeek === 'A')} onClick={() => setSelectedWeek('A')}>
            Semaine A
          </button>
          <button style={headerChipStyle(selectedWeek === 'B')} onClick={() => setSelectedWeek('B')}>
            Semaine B
          </button>

          {/* Export ICS */}
          <button
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
                showToast('Aucun devoir avec date à exporter', 'info');
                return;
              }

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const res: any = await window.storage.exportICS(events);
              if (res && res.success) {
                showToast('Calendrier ICS exporté avec succès !', 'success');
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'var(--bg-card)',
              color: 'var(--text)',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            <i className="ph-bold ph-calendar-plus"></i>
            <span>Exporter ICS</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '16px',
          overflowX: 'auto',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '64px repeat(5, 1fr)',
            minWidth: '700px',
          }}
        >
          {/* Column headers */}
          <div style={{ padding: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }} />
          {DAYS.map((day) => (
            <div
              key={day}
              style={{
                padding: '8px',
                fontWeight: 700,
                textAlign: 'center',
                fontSize: '0.85rem',
                color: 'var(--text)',
                borderBottom: '2px solid var(--border)',
                marginBottom: '4px',
              }}
            >
              {day}
            </div>
          ))}

          {/* Time rows */}
          {TIME_ROWS.map((hour) => (
            <React.Fragment key={hour}>
              {/* Time label */}
              <div
                style={{
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  borderRight: '1px solid var(--border-light)',
                  paddingRight: '6px',
                }}
              >
                {hour}
              </div>

              {/* Day cells */}
              {DAYS.map((day) => {
                const foundSlot = timetable.find((s) => slotMatchesCell(s, day, hour, selectedWeek));

                if (foundSlot) {
                  const bg = foundSlot.color ?? '#6366f1';
                  return (
                    <div
                      key={`${day}-${hour}`}
                      style={{
                        height: '44px',
                        border: '1px solid var(--border-light)',
                        position: 'relative',
                        overflow: 'hidden',
                        background: `${bg}26`,
                        borderLeft: `3px solid ${bg}`,
                        borderRadius: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '2px 4px 2px 6px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              color: 'var(--text)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {foundSlot.subject}
                          </div>
                          <div
                            style={{
                              fontSize: '0.65rem',
                              color: 'var(--text-muted)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {foundSlot.startTime} → {foundSlot.endTime}
                            {foundSlot.room ? ` · ${foundSlot.room}` : ''}
                          </div>
                        </div>
                        <button
                          title="Modifier"
                          onClick={() => setSlotModal({ slot: foundSlot })}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: bg,
                            fontSize: '0.8rem',
                            padding: '0 2px',
                            flexShrink: 0,
                          }}
                        >
                          <i className="ph ph-pencil-simple"></i>
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`${day}-${hour}`}
                    title="Ajouter un cours"
                    onClick={() => setSlotModal({ defaultDay: day, defaultHour: hour })}
                    style={{
                      height: '44px',
                      border: '1px solid var(--border-light)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'transparent',
                      fontSize: '1rem',
                      transition: 'background 0.15s, color 0.15s',
                      borderRadius: '2px',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-input)';
                      (e.currentTarget as HTMLDivElement).style.color = 'var(--text-muted)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                      (e.currentTarget as HTMLDivElement).style.color = 'transparent';
                    }}
                  >
                    <i className="ph ph-plus"></i>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Slot Modal */}
      {slotModal !== null && (
        <SlotModal
          slot={slotModal.slot}
          defaultDay={slotModal.defaultDay}
          defaultHour={slotModal.defaultHour}
          onClose={() => setSlotModal(null)}
        />
      )}
    </div>
  );
};
