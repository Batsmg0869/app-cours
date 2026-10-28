import React from 'react';
import ReactDOM from 'react-dom/client';
import * as pdfjsLib from 'pdfjs-dist';

// Imports de styles (Inter, Phosphor Icons, et Design System de l'app)
import '../assets/fonts/Inter/inter.css';
import '../assets/phosphor/regular/style.css';
import '../assets/phosphor/bold/style.css';
import '../assets/phosphor/thin/style.css';
import '../assets/phosphor/light/style.css';
import '../assets/phosphor/fill/style.css';
import '../assets/phosphor/duotone/style.css';
import '../style.css';

import { AppProvider } from './context/AppContext';
import { AppContent } from './App';

// Configuration du worker PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/js/pdf.worker.min.js';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </React.StrictMode>
  );
}
