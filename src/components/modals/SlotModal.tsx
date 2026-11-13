import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TimetableSlot } from '../../types';

interface SlotModalProps {
  slot?: TimetableSlot | null;
  defaultDay?: string;
  defaultHour?: string;
  onClose: () => void;
}

const COLORS = [
  { hex: '#6366f1', label: 'Violet' },
  { hex: '#22c55e', label: 'Vert' },
  { hex: '#f59e0b', label: 'Orange' },
  { hex: '#ef4444', label: 'Rouge' },
  { hex: '#3b82f6', label: 'Bleu' },
  { hex: '#ec4899', label: 'Rose' },
  { hex: '#14b8a6', label: 'Cyan' },
  { hex: '#a855f7', label: 'Mauve' },
];

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'] as const;

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 7; h <= 19; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 19) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

export const SlotModal: React.FC<SlotModalProps> = ({ slot, defaultDay, defaultHour, onClose }) => {
  const { data, addSlot, updateSlot, deleteSlot } = useApp();

  const isEditing = !!slot;

  const [subject, setSubject] = useState(slot?.subject || data.coursesList[0]?.subject || '');
  const [day, setDay] = useState<string>(slot?.day || defaultDay || 'Lundi');
  const [startTime, setStartTime] = useState(slot?.startTime || defaultHour || '08:00');
  const [endTime, setEndTime] = useState(slot?.endTime || '09:00');
  const [room, setRoom] = useState(slot?.room || '');
  const [color, setColor] = useState(slot?.color || COLORS[0].hex);
  const [week, setWeek] = useState<'A' | 'B' | 'AB'>(slot?.week || 'AB');

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.85rem',
    marginBottom: '6px',
    color: 'var(--text-muted)',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    const slotData = {
      day: day as TimetableSlot['day'],
      startTime,
      endTime,
      subject: subject.trim(),
      room: room.trim() || undefined,
      color,
      week,
    };

    if (isEditing && slot) {
      updateSlot({ ...slotData, id: slot.id });
    } else {
      addSlot(slotData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (slot) {
      deleteSlot(slot.id);
      onClose();
    }
  };

  const endTimeOptions = TIME_SLOTS.filter((t) => t > startTime);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'var(--bg-main)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '480px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph-bold ph-calendar-plus" style={{ color: 'var(--primary)' }}></i>
            {isEditing ? 'Modifier le créneau' : 'Ajouter un créneau'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.2rem' }}
          >
            <i className="ph ph-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Matière */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Matière *</label>
            <input
              type="text"
              required
              list="slot-subjects"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex : Mathématiques"
              style={inputStyle}
            />
            <datalist id="slot-subjects">
              {data.coursesList.map((s) => (
                <option key={s.id} value={s.subject} />
              ))}
            </datalist>
          </div>

          {/* Jour */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Jour *</label>
            <select value={day} onChange={(e) => setDay(e.target.value)} style={inputStyle}>
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Horaires */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={labelStyle}>Heure de début *</label>
              <select
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  if (endTime <= e.target.value) {
                    const idx = TIME_SLOTS.indexOf(e.target.value);
                    setEndTime(TIME_SLOTS[idx + 1] || e.target.value);
                  }
                }}
                style={inputStyle}
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Heure de fin *</label>
              <select value={endTime} onChange={(e) => setEndTime(e.target.value)} style={inputStyle}>
                {endTimeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Salle */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Salle <span style={{ opacity: 0.6 }}>(optionnel)</span></label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Ex : Salle 201"
              style={inputStyle}
            />
          </div>

          {/* Couleur */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Couleur</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  title={c.label}
                  onClick={() => setColor(c.hex)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: c.hex,
                    border: color === c.hex ? '3px solid var(--text)' : '3px solid transparent',
                    cursor: 'pointer',
                    outline: color === c.hex ? `2px solid ${c.hex}` : 'none',
                    outlineOffset: '2px',
                    transition: 'transform 0.1s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Semaine */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Semaine</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['A', 'B', 'AB'] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWeek(w)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: week === w ? 'var(--primary)' : 'var(--bg-input)',
                    color: week === w ? '#fff' : 'var(--text)',
                    cursor: 'pointer',
                    fontWeight: week === w ? 600 : 400,
                    transition: 'all 0.15s',
                  }}
                >
                  {w === 'A' ? 'Semaine A' : w === 'B' ? 'Semaine B' : 'Les deux'}
                </button>
              ))}
            </div>
          </div>

          {/* Boutons */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  marginRight: 'auto',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--urgent)',
                  background: 'rgba(239,68,68,0.1)',
                  color: 'var(--urgent)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <i className="ph ph-trash"></i> Supprimer
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--bg-input)',
                color: 'var(--text)',
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: 'var(--primary)',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <i className="ph ph-check"></i> Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

