import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ToastContainer } from './components/ToastContainer';

// Vues
import { HomeView } from './views/HomeView';
import { TasksView } from './views/TasksView';
import { CoursesView } from './views/CoursesView';
import { DashboardView } from './views/DashboardView';
import { GradesView } from './views/GradesView';
import { ScheduleView } from './views/ScheduleView';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';

// Modals
import { TaskModal } from './components/modals/TaskModal';
import { CourseModal } from './components/modals/CourseModal';
import { SubjectModal } from './components/modals/SubjectModal';
import { GradeModal } from './components/modals/GradeModal';
import { SimulatorModal } from './components/modals/SimulatorModal';
import { PdfViewerModal } from './components/modals/PdfViewerModal';
import { ChangelogModal } from './components/modals/ChangelogModal';

export const AppContent: React.FC = () => {
  const { activeTab, data } = useApp();

  // Appliquer le thème actif
  useEffect(() => {
    const theme = data.settings?.theme;
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
    }

    const isMinecraftTheme = theme === 'minecraft';
    const isMinecraftFont = data.settings?.fontFamily === 'minecraft';

    // Police Minecraft : activée soit par fontFamily setting, soit automatiquement avec le thème
    if (isMinecraftFont || isMinecraftTheme) {
      document.body.classList.add('font-minecraft');
      document.body.style.fontFamily = "Minecraft, Monocraft, monospace";
    } else {
      document.body.classList.remove('font-minecraft');
      document.body.style.fontFamily = '';
    }
  }, [data.settings]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'tasks':
        return <TasksView />;
      case 'courses':
        return <CoursesView />;
      case 'dashboard':
        return <DashboardView />;
      case 'grades':
        return <GradesView />;
      case 'schedule':
        return <ScheduleView />;
      case 'history':
        return <HistoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* BARRE LATÉRALE */}
      <Sidebar />

      {/* CONTENU PRINCIPAL */}
      <main className="main-content" role="main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Topbar />

        <div className="scrollable-content" style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {renderActiveView()}
        </div>
      </main>

      {/* MODALS */}
      <TaskModal />
      <CourseModal />
      <SubjectModal />
      <GradeModal />
      <SimulatorModal />
      <PdfViewerModal />
      <ChangelogModal />

      {/* TOASTS */}
      <ToastContainer />
    </div>
  );
};
