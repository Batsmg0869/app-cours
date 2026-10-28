import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Priority, Task } from '../../types';
import { getLocalDateString } from '../../utils/date';

export const TaskModal: React.FC = () => {
  const { activeModal, setActiveModal, editingTask, setEditingTask, addTask, updateTask, data } = useApp();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setSubject(editingTask.subject || '');
      setDueDate(editingTask.dueDate || '');
      setPriority(editingTask.priority || 'medium');
      setDescription(editingTask.description || '');
      setAttachment(editingTask.attachment);
    } else {
      setTitle('');
      setSubject(data.coursesList[0]?.subject || 'Mathématiques');
      setDueDate(getLocalDateString());
      setPriority('medium');
      setDescription('');
      setAttachment(undefined);
    }
  }, [editingTask, data.coursesList]);

  if (activeModal !== 'task') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask({
        ...editingTask,
        title: title.trim(),
        subject: subject.trim(),
        dueDate,
        priority,
        description: description.trim(),
        attachment,
      });
    } else {
      addTask({
        title: title.trim(),
        subject: subject.trim(),
        dueDate,
        priority,
        description: description.trim(),
        completed: false,
        attachment,
      });
    }

    setEditingTask(null);
    setActiveModal(null);
  };

  const handleClose = () => {
    setEditingTask(null);
    setActiveModal(null);
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="modal-card" style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph-bold ph-check-square" style={{ color: 'var(--primary)' }}></i>
            {editingTask ? 'Modifier le devoir' : 'Nouveau Devoir'}
          </h3>
          <button className="btn-icon" onClick={handleClose}>
            <i className="ph ph-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Titre du devoir *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Exercices 4 et 5 page 128"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Matière</label>
              <input
                type="text"
                list="subjects-list"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex : Mathématiques"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
              <datalist id="subjects-list">
                {data.coursesList.map((s) => (
                  <option key={s.id} value={s.subject} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Date d'échéance</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Priorité</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                const label = p === 'low' ? 'Basse' : p === 'medium' ? 'Normale' : 'Haute';
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--primary-soft)' : 'var(--bg-input)',
                      color: isSelected ? 'var(--primary)' : 'var(--text)',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>
              Description / Consignes <span style={{ opacity: 0.6 }}>(optionnel)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails, liens ou consignes..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)', resize: 'vertical' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>
              Pièce jointe <span style={{ opacity: 0.6 }}>(PDF, document...)</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="file"
                id="task-attachment-input"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const fileWithElectronPath = file as any;
                    let res: any;
                    if (fileWithElectronPath.path) {
                      res = await window.storage?.saveAttachment({
                        filePath: fileWithElectronPath.path,
                        fileName: file.name,
                      });
                    }
                    if (!res || !res.success) {
                      const reader = new FileReader();
                      const b64 = await new Promise<string>((resolve, reject) => {
                        reader.onload = () => {
                          const r = reader.result as string;
                          resolve(r.split(',')[1] || r);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                      });
                      res = await window.storage?.saveAttachment({
                        name: file.name,
                        content: b64,
                      });
                    }
                    if (res && res.success && res.path) {
                      setAttachment(res.path);
                    }
                  } catch (err) {
                    console.error('Erreur attachement:', err);
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => document.getElementById('task-attachment-input')?.click()}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="ph-bold ph-paperclip"></i>
                <span>{attachment ? 'Changer de fichier' : 'Joindre un fichier'}</span>
              </button>
              {attachment && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--primary)' }}>
                  <span>{attachment.split(/[/\\]/).pop()}</span>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => setAttachment(undefined)}
                    title="Retirer la pièce jointe"
                    style={{ color: 'var(--urgent)', padding: '2px' }}
                  >
                    <i className="ph ph-x"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="ph ph-check"></i> {editingTask ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
