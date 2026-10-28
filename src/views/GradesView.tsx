import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import Chart from 'chart.js/auto';

export const GradesView: React.FC = () => {
  const { data, deleteGrade, setActiveModal, updateSettings } = useApp();

  const [selectedTrim, setSelectedTrim] = useState<string>(data.settings.selectedTrimester || 'ALL');
  const [targetAverageInput, setTargetAverageInput] = useState<number>(data.settings.targetAverage || 15);

  useEffect(() => {
    if (data.settings?.selectedTrimester) {
      setSelectedTrim(data.settings.selectedTrimester);
    }
    if (data.settings?.targetAverage !== undefined) {
      setTargetAverageInput(data.settings.targetAverage);
    }
  }, [data.settings?.selectedTrimester, data.settings?.targetAverage]);

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Filtrer les notes selon le trimestre
  const filteredGrades = useMemo(() => {
    if (selectedTrim === 'ALL') return data.grades;
    return data.grades.filter((g) => (g.trimester || 'T1') === selectedTrim);
  }, [data.grades, selectedTrim]);

  // Calcul moyenne générale
  const overallAverage = useMemo(() => {
    if (filteredGrades.length === 0) return null;
    let sum = 0;
    let totalCoef = 0;
    for (const g of filteredGrades) {
      const coef = g.weight || 1;
      const normalized = (g.value / (g.max || 20)) * 20;
      sum += normalized * coef;
      totalCoef += coef;
    }
    return totalCoef > 0 ? (sum / totalCoef).toFixed(2) : null;
  }, [filteredGrades]);

  // Distinction / Mention
  const distinction = useMemo(() => {
    if (!overallAverage) return null;
    const avg = parseFloat(overallAverage);
    if (avg >= 16) return { text: 'Mention Très Bien 🌟', color: 'var(--success)' };
    if (avg >= 14) return { text: 'Mention Bien ✨', color: 'var(--primary)' };
    if (avg >= 12) return { text: 'Mention Assez Bien 👍', color: 'var(--accent)' };
    if (avg >= 10) return { text: 'Moyenne Validée 🎯', color: 'var(--warning)' };
    return { text: 'Efforts Requis ⚠️', color: 'var(--urgent)' };
  }, [overallAverage]);

  // Moyennes par matière
  const subjectAverages = useMemo(() => {
    const map: Record<string, { sum: number; coef: number; count: number }> = {};
    for (const g of filteredGrades) {
      if (!map[g.subject]) {
        map[g.subject] = { sum: 0, coef: 0, count: 0 };
      }
      const coef = g.weight || 1;
      const normalized = (g.value / (g.max || 20)) * 20;
      map[g.subject].sum += normalized * coef;
      map[g.subject].coef += coef;
      map[g.subject].count += 1;
    }

    return Object.entries(map).map(([subject, stats]) => ({
      subject,
      average: (stats.sum / stats.coef).toFixed(2),
      count: stats.count,
    })).sort((a, b) => parseFloat(b.average) - parseFloat(a.average));
  }, [filteredGrades]);

  // Note requise pour atteindre l'objectif
  const targetRequiredGrade = useMemo(() => {
    if (filteredGrades.length === 0) return null;
    let currentSum = 0;
    let currentCoef = 0;
    for (const g of filteredGrades) {
      const coef = g.weight || 1;
      currentSum += ((g.value / (g.max || 20)) * 20) * coef;
      currentCoef += coef;
    }
    const nextCoef = 1;
    const needed = (targetAverageInput * (currentCoef + nextCoef) - currentSum) / nextCoef;
    return needed;
  }, [filteredGrades, targetAverageInput]);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart before creating a new one
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const sortedByDate = [...filteredGrades].sort((a, b) => {
      return (a.date || '').localeCompare(b.date || '');
    });

    const labels = sortedByDate.map((g, i) => g.title || `${g.subject} (#${i + 1})`);
    const values = sortedByDate.map((g) => ((g.value / (g.max || 20)) * 20));

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Note (/20)',
            data: values,
            borderColor: '#818cf8',
            backgroundColor: 'rgba(129, 140, 248, 0.12)',
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#c084fc',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 20,
            grid: { color: 'rgba(255, 255, 255, 0.06)' },
            ticks: { color: '#94a3b8', stepSize: 4 },
          },
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.04)' },
            ticks: { color: '#94a3b8' },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#f8fafc',
            bodyColor: '#cbd5e1',
            padding: 12,
            cornerRadius: 10,
            borderColor: 'rgba(255, 255, 255, 0.15)',
            borderWidth: 1,
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [filteredGrades]);

  const handleTrimesterChange = (trim: string) => {
    setSelectedTrim(trim);
    updateSettings({ selectedTrimester: trim });
  };

  const handleTargetChange = (val: number) => {
    const clamped = Math.max(0, Math.min(20, val));
    setTargetAverageInput(clamped);
    updateSettings({ targetAverage: clamped });
  };

  return (
    <div className="tab-pane active" id="tab-grades" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* BARRE D'ACTIONS ET FILTRES */}
      <div
        className="section-card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { key: 'ALL', label: 'Toute l’année' },
            { key: 'T1', label: 'Trimestre 1' },
            { key: 'T2', label: 'Trimestre 2' },
            { key: 'T3', label: 'Trimestre 3' },
          ].map((t) => {
            const isSelected = selectedTrim === t.key;
            return (
              <button
                key={t.key}
                className={`chip ${isSelected ? 'active' : ''}`}
                onClick={() => handleTrimesterChange(t.key)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '999px',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                  background: isSelected ? 'var(--primary)' : 'var(--bg-input)',
                  color: isSelected ? '#fff' : 'var(--text)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => setActiveModal('simulator')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px' }}
          >
            <i className="ph-bold ph-calculator"></i>
            <span>Simulateur rapide</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setActiveModal('grade')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px' }}
          >
            <i className="ph-bold ph-plus"></i>
            <span>Ajouter une note</span>
          </button>
        </div>
      </div>

      {/* CARTES STATISTIQUES MOYENNE & OBJECTIF */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Moyenne Générale */}
        <div
          className="section-card"
          style={{
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.7))',
          }}
        >
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '2.1rem',
              fontWeight: 800,
              flexShrink: 0,
              boxShadow: '0 8px 24px var(--primary-soft)',
            }}
          >
            {overallAverage !== null ? overallAverage.split('.')[0] : '--'}
            <span style={{ fontSize: '1.1rem', opacity: 0.85 }}>
              {overallAverage !== null ? `.${overallAverage.split('.')[1]}` : ''}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Moyenne Générale
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 6px 0' }}>
              {overallAverage !== null ? `${overallAverage} / 20` : 'Aucune note'}
            </div>
            {distinction && (
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: distinction.color }}>
                {distinction.text}
              </div>
            )}
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {filteredGrades.length} note{filteredGrades.length > 1 ? 's' : ''} prise{filteredGrades.length > 1 ? 's' : ''} en compte ({selectedTrim})
            </div>
          </div>
        </div>

        {/* Simulateur d'Objectif interactif */}
        <div className="section-card" style={{ padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="ph-bold ph-target" style={{ color: 'var(--accent)' }}></i>
              <span>Objectif de Moyenne</span>
            </h3>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>
              {targetAverageInput} / 20
            </span>
          </div>

          {/* Slider interactif */}
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={targetAverageInput}
            onChange={(e) => handleTargetChange(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent)', marginBottom: '16px' }}
          />

          <div style={{ background: 'var(--bg-input)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Note requise au prochain contrôle (coeff. 1) :
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: targetRequiredGrade !== null && targetRequiredGrade > 20 ? 'var(--urgent)' : 'var(--primary)' }}>
              {targetRequiredGrade !== null ? (
                targetRequiredGrade <= 0 ? (
                  <span style={{ color: 'var(--success)' }}>✨ Objectif déjà assuré ! (0/20 suffit)</span>
                ) : targetRequiredGrade > 20 ? (
                  `⚠️ ${targetRequiredGrade.toFixed(2)}/20 (plusieurs devoirs nécessaires)`
                ) : (
                  `Obtenir au moins ${targetRequiredGrade.toFixed(2)} / 20`
                )
              ) : (
                'Ajoute des notes pour simuler'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* GRAPHIQUE D'ÉVOLUTION */}
      <div className="section-card" style={{ marginBottom: '24px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="ph-bold ph-chart-line-up" style={{ color: 'var(--primary)' }}></i>
          <span>Courbe d'Évolution des Notes</span>
        </h3>
        <div style={{ height: '240px', width: '100%' }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </div>

      {/* MOYENNES PAR MATIÈRE */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 14px 0', fontSize: '1.1rem', fontWeight: 700 }}>Moyennes par Matière</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
          {subjectAverages.map((sub) => {
            const avgNum = parseFloat(sub.average);
            const percent = Math.min(100, Math.round((avgNum / 20) * 100));

            return (
              <div
                key={sub.subject}
                className="section-card"
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.94rem' }}>{sub.subject}</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {sub.average}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/20</span>
                  </div>
                </div>

                {/* Petite barre de niveau */}
                <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${percent}%`,
                      background: avgNum >= 14 ? 'var(--success)' : avgNum >= 10 ? 'var(--primary)' : 'var(--urgent)',
                      borderRadius: '999px',
                    }}
                  />
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {sub.count} note{sub.count > 1 ? 's' : ''} enregistrée{sub.count > 1 ? 's' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* HISTORIQUE DÉTAILLÉ DES ÉVALUATIONS */}
      <div className="section-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700 }}>Historique des Évaluations</h3>
        {filteredGrades.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredGrades.map((grade) => (
              <div
                key={grade.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'var(--primary-soft)',
                      color: 'var(--primary)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      flexShrink: 0,
                    }}
                  >
                    <span>{grade.value}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.75 }}>/{grade.max || 20}</span>
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.96rem' }}>{grade.title || grade.subject}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {grade.subject} • Coeff. {grade.weight || 1} • {grade.trimester || 'T1'} • {grade.date || 'Sans date'}
                    </div>
                  </div>
                </div>

                <button
                  className="btn-icon"
                  onClick={() => deleteGrade(grade.id)}
                  title="Supprimer cette note"
                  style={{ color: 'var(--urgent)' }}
                >
                  <i className="ph-bold ph-trash"></i>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            Aucune note enregistrée pour cette période.
          </div>
        )}
      </div>
    </div>
  );
};
