import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import * as pdfjsLib from 'pdfjs-dist';

export const PdfViewerModal: React.FC = () => {
  const { activeModal, setActiveModal, activePdfPath, showToast } = useApp();

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);

  // Charger le PDF
  useEffect(() => {
    if (activeModal !== 'pdf' || !activePdfPath) return;

    let isCancelled = false;
    setLoading(true);
    setPageNum(1);

    const loadPdfFile = async () => {
      try {
        if (!window.storage?.loadPDF) {
          throw new Error('Pont IPC non disponible');
        }

        const base64 = await window.storage.loadPDF(activePdfPath);
        if (!base64) {
          throw new Error('Fichier introuvable');
        }

        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const loadingTask = (pdfjsLib as any).getDocument({ data: bytes });
        const doc = await loadingTask.promise;

        if (!isCancelled) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Erreur chargement PDF:', err);
        if (!isCancelled) {
          showToast(`Impossible de charger le PDF : ${err.message || 'Fichier introuvable'}`, 'error');
          setActiveModal(null);
        }
      }
    };

    loadPdfFile();

    return () => {
      isCancelled = true;
    };
  }, [activeModal, activePdfPath, showToast, setActiveModal]);

  // Rendu de la page courante sur le canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isCancelled = false;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Erreur rendu page PDF:', err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, pageNum, scale]);

  if (activeModal !== 'pdf') return null;

  const handleClose = () => {
    if (pdfDoc) {
      pdfDoc.destroy();
      setPdfDoc(null);
    }
    setActiveModal(null);
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        className="modal-card"
        style={{
          background: 'var(--bg-main)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          width: '95%',
          maxWidth: '920px',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          overflow: 'hidden',
        }}
      >
        {/* EN-TÊTE DU VIEWER */}
        <div
          style={{
            padding: '12px 18px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="ph-bold ph-file-pdf" style={{ color: 'var(--primary)', fontSize: '1.4rem' }}></i>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {activePdfPath ? activePdfPath.split('/').pop()?.split('\\').pop() : 'Document PDF'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Navigation pages */}
            <button
              className="btn-icon"
              disabled={pageNum <= 1}
              onClick={() => setPageNum((p) => Math.max(1, p - 1))}
              title="Page précédente"
            >
              <i className="ph ph-caret-left"></i>
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Page {pageNum} / {totalPages}
            </span>
            <button
              className="btn-icon"
              disabled={pageNum >= totalPages}
              onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))}
              title="Page suivante"
            >
              <i className="ph ph-caret-right"></i>
            </button>

            <span style={{ height: '18px', width: '1px', background: 'var(--border)', margin: '0 4px' }}></span>

            {/* Zoom */}
            <button
              className="btn-icon"
              onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
              title="Dézoomer"
            >
              <i className="ph ph-magnifying-glass-minus"></i>
            </button>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{Math.round(scale * 100)}%</span>
            <button
              className="btn-icon"
              onClick={() => setScale((s) => Math.min(2.5, s + 0.2))}
              title="Zoomer"
            >
              <i className="ph ph-magnifying-glass-plus"></i>
            </button>

            <span style={{ height: '18px', width: '1px', background: 'var(--border)', margin: '0 4px' }}></span>

            <button className="btn-icon" onClick={handleClose} title="Fermer">
              <i className="ph ph-x"></i>
            </button>
          </div>
        </div>

        {/* ZONE DE RENDU DU PDF */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '24px',
            background: 'var(--bg-input)',
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-muted)' }}>
              <i className="ph-bold ph-spinner ph-spin" style={{ fontSize: '2.5rem', marginBottom: '10px' }}></i>
              <div>Chargement du document PDF...</div>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              style={{
                borderRadius: '8px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                maxWidth: '100%',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
