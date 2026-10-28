import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const GradeModal: React.FC = () => {
  const { activeModal, setActiveModal, data, addGrade } = useApp();

  const [subject, setSubject] = useState(data.coursesList[0]?.subject || 'Mathématiques');
  const [value, setValue] = useState<number>(15);
  const [max, setMax] = useState<number>(20);
  const [weight, setWeight] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [trimester, setTrimester] = useState<'T1' | 'T2' | 'T3'>('T1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (activeModal !== 'grade') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(value) || value < 0) return;

    addGrade({
      subject: subject.trim(),
      value: Number(value),
      max: Number(max) || 20,
      weight: Number(weight) || 1,
      title: title.trim() || undefined,
      trimester,
      date,
    });

    setActiveModal(null);
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="modal-card" style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '20px', width: '100%', maxWidth: '440px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph-bold ph-exam" style={{ color: 'var(--primary)' }}></i>
            Ajouter une Note
          </h3>
          <button className="btn-icon" onClick={() => setActiveModal(null)}>
            <i className="ph ph-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Matière *</label>
            <input
              type="text"
              required
              list="grade-subjects"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex : Mathématiques"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
            <datalist id="grade-subjects">
              {data.coursesList.map((s) => (
                <option key={s.id} value={s.subject} />
              ))}
            </datalist>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Note obtenue *</label>
              <input
                type="number"
                required
                min="0"
                max={max}
                step="0.25"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Barème (sur)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={max}
                onChange={(e) => setMax(parseFloat(e.target.value))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Coefficient</label>
              <input
                type="number"
                min="0.25"
                step="0.25"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Période / Trimestre</label>
              <select
                value={trimester}
                onChange={(e) => setTrimester(e.target.value as any)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
              >
                <option value="T1">Trimestre 1</option>
                <option value="T2">Trimestre 2</option>
                <option value="T3">Trimestre 3</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>
              Intitulé du devoir / contrôle <span style={{ opacity: 0.6 }}>(optionnel)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Contrôle n°2 Théorème de Pythagore"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="ph ph-check"></i> Enregistrer la note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
