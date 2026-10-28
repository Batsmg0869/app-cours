import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export const SimulatorModal: React.FC = () => {
  const { activeModal, setActiveModal, data } = useApp();

  const [simGrade, setSimGrade] = useState<number>(16);
  const [simCoef, setSimCoef] = useState<number>(1);
  const [calculated, setCalculated] = useState(false);

  // Moyenne actuelle
  const currentAverage = useMemo(() => {
    if (!data.grades || data.grades.length === 0) return null;
    let sum = 0;
    let totalCoef = 0;
    for (const g of data.grades) {
      const coef = g.weight || 1;
      const normalized = (g.value / (g.max || 20)) * 20;
      sum += normalized * coef;
      totalCoef += coef;
    }
    return totalCoef > 0 ? { avg: sum / totalCoef, sum, coef: totalCoef } : null;
  }, [data.grades]);

  // Nouvelle moyenne simulée
  const newAverage = useMemo(() => {
    if (!currentAverage) return simGrade;
    const nextSum = currentAverage.sum + simGrade * simCoef;
    const nextCoef = currentAverage.coef + simCoef;
    return nextSum / nextCoef;
  }, [currentAverage, simGrade, simCoef]);

  if (activeModal !== 'simulator') return null;

  const delta = currentAverage ? newAverage - currentAverage.avg : 0;

  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div className="modal-card" style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '20px', width: '100%', maxWidth: '440px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ph-bold ph-calculator" style={{ color: 'var(--primary)' }}></i>
            Simulateur de Moyenne
          </h3>
          <button className="btn-icon" onClick={() => setActiveModal(null)}>
            <i className="ph ph-x"></i>
          </button>
        </div>

        <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Simule l'impact d'une prochaine note sur ta moyenne générale.
        </p>

        <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>Moyenne actuelle :</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
            {currentAverage ? `${currentAverage.avg.toFixed(2)}/20` : '--/20'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Note simulée (/20)</label>
            <input
              type="number"
              min="0"
              max="20"
              step="0.5"
              value={simGrade}
              onChange={(e) => {
                setSimGrade(parseFloat(e.target.value) || 0);
                setCalculated(true);
              }}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>
          <div className="form-group">
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>Coefficient</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={simCoef}
              onChange={(e) => {
                setSimCoef(parseFloat(e.target.value) || 1);
                setCalculated(true);
              }}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
          </div>
        </div>

        {/* RÉSULTAT */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nouvelle moyenne :</span>
            <span style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)' }}>
              {newAverage.toFixed(2)} / 20
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Évolution :</span>
            <span
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: delta >= 0 ? 'var(--success)' : 'var(--urgent)',
              }}
            >
              {delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)} pts
            </span>
          </div>
        </div>

        <button className="btn btn-primary w-full" onClick={() => setActiveModal(null)}>
          Fermer
        </button>
      </div>
    </div>
  );
};
