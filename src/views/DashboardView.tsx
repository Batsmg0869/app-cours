import React, { useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Chart from 'chart.js/auto';

export const DashboardView: React.FC = () => {
  const { data } = useApp();

  const chartSubjectsRef = useRef<HTMLCanvasElement | null>(null);
  const chartCompletionRef = useRef<HTMLCanvasElement | null>(null);
  const chartSubjectsInstance = useRef<Chart | null>(null);
  const chartCompletionInstance = useRef<Chart | null>(null);

  // Distribution par matière
  const subjectDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of data.tasks) {
      const sub = t.subject || 'Autre';
      counts[sub] = (counts[sub] || 0) + 1;
    }
    return counts;
  }, [data.tasks]);

  // Complétion
  const completionStats = useMemo(() => {
    const completed = data.tasks.filter((t) => t.completed).length;
    const pending = data.tasks.length - completed;
    return { completed, pending };
  }, [data.tasks]);

  useEffect(() => {
    // 1. Chart Matières
    if (chartSubjectsRef.current) {
      const labels = Object.keys(subjectDistribution);
      const values = Object.values(subjectDistribution);

      if (chartSubjectsInstance.current) {
        chartSubjectsInstance.current.data.labels = labels;
        chartSubjectsInstance.current.data.datasets[0].data = values;
        chartSubjectsInstance.current.update('none');
      } else {
        const ctx = chartSubjectsRef.current.getContext('2d');
        if (ctx) {
          chartSubjectsInstance.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels,
              datasets: [
                {
                  data: values,
                  backgroundColor: [
                    '#818cf8',
                    '#c084fc',
                    '#34d399',
                    '#fbbf24',
                    '#fb7185',
                    '#38bdf8',
                    '#a78bfa',
                  ],
                  borderWidth: 2,
                  borderColor: '#0f172a',
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8' } },
              },
            },
          });
        }
      }
    }

    // 2. Chart Complétion
    if (chartCompletionRef.current) {
      const labels = ['Terminés', 'En attente'];
      const values = [completionStats.completed, completionStats.pending];

      if (chartCompletionInstance.current) {
        chartCompletionInstance.current.data.labels = labels;
        chartCompletionInstance.current.data.datasets[0].data = values;
        chartCompletionInstance.current.update('none');
      } else {
        const ctx = chartCompletionRef.current.getContext('2d');
        if (ctx) {
          chartCompletionInstance.current = new Chart(ctx, {
            type: 'pie',
            data: {
              labels,
              datasets: [
                {
                  data: values,
                  backgroundColor: ['#34d399', '#fb7185'],
                  borderWidth: 2,
                  borderColor: '#0f172a',
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8' } },
              },
            },
          });
        }
      }
    }

    return () => {
      if (chartSubjectsInstance.current) {
        chartSubjectsInstance.current.destroy();
        chartSubjectsInstance.current = null;
      }
      if (chartCompletionInstance.current) {
        chartCompletionInstance.current.destroy();
        chartCompletionInstance.current = null;
      }
    };
  }, [subjectDistribution, completionStats]);

  return (
    <div className="tab-pane active" id="tab-dashboard">
      <h2 style={{ margin: '0 0 20px 0', fontSize: '1.4rem' }}>Tableau de Bord & Statistiques</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="section-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', textAlign: 'center' }}>
            Répartition des devoirs par matière
          </h3>
          <div style={{ height: '260px', width: '100%' }}>
            <canvas ref={chartSubjectsRef}></canvas>
          </div>
        </div>

        <div className="section-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', textAlign: 'center' }}>
            Taux de complétion des devoirs
          </h3>
          <div style={{ height: '260px', width: '100%' }}>
            <canvas ref={chartCompletionRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};
