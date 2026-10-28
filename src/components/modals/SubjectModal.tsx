import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const SubjectModal: React.FC = () => {
  const { activeModal, setActiveModal, addSubject } = useApp();
  const [subjectName, setSubjectName] = useState('');

  if (activeModal !== 'subject') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;
    addSubject(subjectName.trim());
    setSubjectName('');
    setActiveModal(null);
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="modal-card" style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '20px', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph-bold ph-folder-plus" style={{ color: 'var(--primary)' }}></i>
            Nouvelle Matière
          </h3>
          <button className="btn-icon" onClick={() => setActiveModal(null)}>
            <i className="ph ph-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Nom de la matière *</label>
            <input
              type="text"
              required
              autoFocus
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Ex : Philosophie, Informatique..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="ph ph-plus"></i> Créer la matière
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
