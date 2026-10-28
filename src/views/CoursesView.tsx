import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const CoursesView: React.FC = () => {
  const { data, deleteCourse, setActivePdfPath, setActiveModal, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  // Palette d'accents par matière
  const subjectColors: Record<string, { bg: string; color: string; border: string }> = {
    Mathématiques: { bg: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', border: 'rgba(129, 140, 248, 0.3)' },
    'Physique-Chimie': { bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)' },
    Histoire: { bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' },
    Géographie: { bg: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: 'rgba(52, 211, 153, 0.3)' },
    Français: { bg: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', border: 'rgba(244, 63, 94, 0.3)' },
    Anglais: { bg: 'rgba(192, 132, 252, 0.15)', color: '#c084fc', border: 'rgba(192, 132, 252, 0.3)' },
    Espagnol: { bg: 'rgba(249, 115, 22, 0.15)', color: '#f97316', border: 'rgba(249, 115, 22, 0.3)' },
    SVT: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
  };

  const getSubjectColor = (name: string) => {
    return (
      subjectColors[name] || {
        bg: 'rgba(129, 140, 248, 0.15)',
        color: 'var(--primary)',
        border: 'var(--border)',
      }
    );
  };

  // Filtrer les matières et cours
  const filteredCourseSubjects = useMemo(() => {
    return data.coursesList
      .filter((s) => {
        if (selectedSubjectFilter !== 'all' && s.subject !== selectedSubjectFilter) {
          return false;
        }
        return true;
      })
      .map((s) => {
        if (!searchQuery.trim()) return s;
        const q = searchQuery.toLowerCase();
        const matchingCourses = (s.courses || []).filter((c) => {
          return (
            c.title.toLowerCase().includes(q) ||
            (c.description && c.description.toLowerCase().includes(q))
          );
        });
        return {
          ...s,
          courses: matchingCourses,
        };
      })
      .filter((s) => {
        if (!searchQuery.trim()) return true;
        return s.courses.length > 0;
      });
  }, [data.coursesList, searchQuery, selectedSubjectFilter]);

  const handleOpenPdf = (pdfPath?: string) => {
    if (!pdfPath) {
      showToast('Aucun fichier PDF rattaché à ce cours', 'info');
      return;
    }
    setActivePdfPath(pdfPath);
    setActiveModal('pdf');
  };

  const handleDownloadPdf = async (pdfPath?: string) => {
    if (!pdfPath) return;
    if (window.storage?.downloadPDF) {
      const ok = await window.storage.downloadPDF(pdfPath);
      if (ok) {
        showToast('Fichier PDF téléchargé dans vos Téléchargements !', 'success');
      } else {
        showToast('Erreur lors du téléchargement du PDF', 'error');
      }
    }
  };

  return (
    <div className="tab-pane active" id="tab-courses" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* BARRE D'ACTIONS */}
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
        <div className="search-bar" style={{ flex: '1 1 240px', minWidth: '220px' }}>
          <i className="ph ph-magnifying-glass search-icon" aria-hidden="true"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher une fiche, un chapitre, un mot-clé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="btn-icon" onClick={() => setSearchQuery('')} style={{ marginRight: '4px' }}>
              <i className="ph ph-x"></i>
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setActiveModal('subject')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px' }}
          >
            <i className="ph-bold ph-folder-plus"></i>
            <span>Nouvelle matière</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setActiveModal('course')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px' }}
          >
            <i className="ph-bold ph-plus"></i>
            <span>Ajouter une fiche / cours</span>
          </button>
        </div>
      </div>

      {/* FILTRES PAR MATIÈRE */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          className={`chip ${selectedSubjectFilter === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedSubjectFilter('all')}
          style={{
            padding: '7px 16px',
            borderRadius: '999px',
            border: selectedSubjectFilter === 'all' ? '1px solid var(--primary)' : '1px solid var(--border)',
            background: selectedSubjectFilter === 'all' ? 'var(--primary)' : 'var(--bg-card)',
            color: selectedSubjectFilter === 'all' ? '#fff' : 'var(--text)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          Toutes
        </button>
        {data.coursesList.map((s) => {
          const isSelected = selectedSubjectFilter === s.subject;
          const styling = getSubjectColor(s.subject);
          return (
            <button
              key={s.id}
              className={`chip ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedSubjectFilter(s.subject)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                borderRadius: '999px',
                border: isSelected ? `1px solid ${styling.color}` : '1px solid var(--border)',
                background: isSelected ? styling.color : 'var(--bg-card)',
                color: isSelected ? '#fff' : 'var(--text)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <span>{s.subject}</span>
              <span
                style={{
                  padding: '1px 7px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-input)',
                  fontWeight: 700,
                }}
              >
                {s.courses?.length || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* LISTE DES MATIÈRES ET FICHES */}
      {filteredCourseSubjects.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {filteredCourseSubjects.map((subj) => {
            const styling = getSubjectColor(subj.subject);

            return (
              <div key={subj.id} className="subject-section">
                {/* EN-TÊTE DE SECTION MATIÈRE */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: styling.bg,
                        color: styling.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                      }}
                    >
                      <i className="ph-bold ph-folder"></i>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                      {subj.subject}
                    </h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      ({subj.courses?.length || 0} fiche{subj.courses?.length > 1 ? 's' : ''})
                    </span>
                  </div>
                </div>

                {/* GRILLE DES COURS */}
                {subj.courses && subj.courses.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '16px' }}>
                    {subj.courses.map((course) => (
                      <div
                        key={course.id}
                        className="course-item-card section-card"
                        style={{
                          padding: '18px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '14px',
                          borderLeft: `4px solid ${styling.color}`,
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                            <span
                              style={{
                                fontSize: '0.78rem',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <i className="ph ph-calendar"></i>
                              {course.date || 'Fiche de révision'}
                            </span>

                            <button
                              className="btn-icon"
                              onClick={() => deleteCourse(subj.subject, course.id)}
                              title="Supprimer ce cours"
                              style={{ color: 'var(--urgent)', padding: '2px' }}
                            >
                              <i className="ph-bold ph-trash"></i>
                            </button>
                          </div>

                          <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.35 }}>
                            {course.title}
                          </h4>

                          {course.description && (
                            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-dim)', lineHeight: 1.45 }}>
                              {course.description}
                            </p>
                          )}
                        </div>

                        {/* ACTIONS COURS */}
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', gap: '8px' }}>
                          {course.pdf ? (
                            <>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleOpenPdf(course.pdf)}
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600 }}
                              >
                                <i className="ph-bold ph-file-pdf"></i>
                                <span>Lire la fiche PDF</span>
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleDownloadPdf(course.pdf)}
                                title="Télécharger sur votre ordinateur"
                              >
                                <i className="ph-bold ph-download-simple"></i>
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              Aucun fichier PDF rattaché
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="section-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Aucune fiche enregistrée dans cette matière.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="section-card" style={{ textAlign: 'center', padding: '70px 20px', color: 'var(--text-muted)' }}>
          <i className="ph-duotone ph-folder-notch-open" style={{ fontSize: '3.5rem', color: 'var(--primary)', marginBottom: '14px' }}></i>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--text)' }}>Aucune fiche de cours trouvée</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem' }}>
            Commence par créer une matière ou importer tes fiches de cours PDF.
          </p>
          <button className="btn btn-primary" onClick={() => setActiveModal('course')}>
            <i className="ph-bold ph-plus"></i> Ajouter ma première fiche
          </button>
        </div>
      )}
    </div>
  );
};
