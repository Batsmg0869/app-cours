import React, { useState, useEffect } from 'react';
import { getLocalDateString } from '../../utils/date';
import { useApp } from '../../context/AppContext';

export const CourseModal: React.FC = () => {
  const { activeModal, setActiveModal, data, addCourse, showToast } = useApp();

  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getLocalDateString());
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form each time the modal opens
  useEffect(() => {
    if (activeModal === 'course') {
      setSubject(data.coursesList[0]?.subject || '');
      setTitle('');
      setDescription('');
      setDate(getLocalDateString());
      setPdfFile(null);
      setIsSubmitting(false);
    }
  }, [activeModal, data.coursesList]);

  if (activeModal !== 'course') return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        showToast('Veuillez sélectionner un fichier PDF', 'error');
        return;
      }
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject) {
      showToast('Veuillez renseigner la matière et le titre', 'error');
      return;
    }

    setIsSubmitting(true);
    let pdfPath: string | undefined = undefined;

    if (pdfFile) {
      try {
        const fileWithElectronPath = pdfFile as any;
        let res: { success: boolean; path?: string; fileName?: string; error?: string } | undefined;

        if (fileWithElectronPath.path) {
          res = await window.storage?.saveAttachment({
            filePath: fileWithElectronPath.path,
            fileName: pdfFile.name,
          });
        }

        if (!res || !res.success) {
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onload = () => {
              const result = reader.result as string;
              const base64 = result.split(',')[1] || result;
              resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(pdfFile);
          });

          const base64Data = await base64Promise;
          if (window.storage?.saveAttachment) {
            res = await window.storage.saveAttachment({
              name: pdfFile.name,
              content: base64Data,
            });
          }
        }

        if (res && res.success && res.path) {
          pdfPath = res.path;
        } else {
          showToast('Impossible de sauvegarder le fichier PDF', 'error');
        }
      } catch (err) {
        console.error('Erreur attachement PDF:', err);
        showToast('Erreur lors de la sauvegarde du fichier PDF', 'error');
      }
    }

    addCourse(subject, {
      title: title.trim(),
      description: description.trim(),
      date,
      pdf: pdfPath,
    });

    setIsSubmitting(false);
    // Reset form
    setTitle('');
    setDescription('');
    setPdfFile(null);
    setDate(getLocalDateString());
    setActiveModal(null);
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="modal-card" style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph-bold ph-books" style={{ color: 'var(--primary)' }}></i>
            Nouveau Cours / Fiche PDF
          </h3>
          <button className="btn-icon" onClick={() => setActiveModal(null)}>
            <i className="ph ph-x"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Matière *</label>
            <select
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              <option value="">-- Choisir une matière --</option>
              {data.coursesList.map((s) => (
                <option key={s.id} value={s.subject}>
                  {s.subject}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Titre du cours *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Les fonctions affines"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Description / Résumé</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notions clés, formules..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Fichier PDF (optionnel)</label>
            <div
              style={{
                border: '2px dashed var(--border)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'var(--bg-card)',
              }}
              onClick={() => document.getElementById('course-file-input')?.click()}
            >
              <i className="ph ph-file-pdf" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '6px' }}></i>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                {pdfFile ? pdfFile.name : 'Cliquez pour choisir un PDF'}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Format .pdf uniquement</span>
              <input
                type="file"
                id="course-file-input"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)} disabled={isSubmitting}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <i className="ph ph-check"></i> {isSubmitting ? 'Sauvegarde...' : 'Enregistrer le cours'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
