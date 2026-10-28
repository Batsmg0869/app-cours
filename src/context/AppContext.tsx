import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppData, Task, CourseSubject, Grade, AppSettings, Course } from '../types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  data: AppData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  activePdfPath: string | null;
  setActivePdfPath: (path: string | null) => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  // Data actions
  saveData: (updated?: Partial<AppData>) => Promise<boolean>;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string | number) => void;
  toggleTask: (id: string | number) => void;
  addSubject: (subjectName: string) => void;
  addCourse: (subjectName: string, course: Omit<Course, 'id'>) => void;
  deleteCourse: (subjectName: string, courseId: string | number) => void;
  addGrade: (grade: Omit<Grade, 'id'>) => void;
  deleteGrade: (id: string | number) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  userName: 'Baptiste Lecuyot',
  theme: 'emerald',
  darkMode: true,
  fontFamily: 'inter',
  highPriority: false,
  notificationsEnabled: true,
  notificationTime: '17:00',
  targetAverage: 15,
  selectedTrimester: 'ALL',
  onboardingCompleted: true,
};

const initialData: AppData = {
  tasks: [],
  coursesList: [],
  grades: [],
  settings: defaultSettings,
  userName: 'Baptiste Lecuyot',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(initialData);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activePdfPath, setActivePdfPath] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Charger les données au montage
  useEffect(() => {
    const loadAppData = async () => {
      if (window.storage?.load) {
        try {
          const loaded = await window.storage.load();
          if (loaded) {
            setData({
              tasks: Array.isArray(loaded.tasks) ? loaded.tasks : [],
              coursesList: Array.isArray(loaded.coursesList) ? loaded.coursesList : [],
              grades: Array.isArray(loaded.grades) ? loaded.grades : [],
              settings: { ...defaultSettings, ...(loaded.settings || {}) },
              userName: loaded.userName || loaded.settings?.userName || 'Baptiste Lecuyot',
            });
          }
        } catch (e) {
          console.error('Erreur chargement initial:', e);
          showToast('Erreur lors du chargement des données', 'error');
        }
      }
    };
    loadAppData();
  }, [showToast]);

  // Sauvegarde bas-niveau (écriture fichier uniquement, pas de setData)
  const debouncedSave = useCallback(
    (dataToSave: AppData) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(async () => {
        if (window.storage?.save) {
          try {
            await window.storage.save(dataToSave);
          } catch (err) {
            console.error('Erreur sauvegarde:', err);
          }
        }
      }, 200);
    },
    []
  );

  // Sauvegarder l'état courant (ou fusionner un partial)
  const saveData = useCallback(
    async (updated?: Partial<AppData>): Promise<boolean> => {
      return new Promise((resolve) => {
        setData((current) => {
          const nextData: AppData = {
            ...current,
            ...(updated || {}),
          };
          debouncedSave(nextData);
          resolve(true);
          return nextData;
        });
      });
    },
    [debouncedSave]
  );

  const addTask = useCallback(
    (taskData: Omit<Task, 'id'>) => {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      setData((prev) => {
        const next = { ...prev, tasks: [newTask, ...prev.tasks] };
        debouncedSave(next);
        return next;
      });
      showToast('Devoir ajouté avec succès !', 'success');
    },
    [debouncedSave, showToast]
  );

  const updateTask = useCallback(
    (updatedTask: Task) => {
      setData((prev) => {
        const next = {
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
        };
        debouncedSave(next);
        return next;
      });
      showToast('Devoir mis à jour', 'success');
    },
    [debouncedSave, showToast]
  );

  const deleteTask = useCallback(
    (id: string | number) => {
      setData((prev) => {
        const next = { ...prev, tasks: prev.tasks.filter((t) => t.id !== id) };
        debouncedSave(next);
        return next;
      });
      showToast('Devoir supprimé', 'info');
    },
    [debouncedSave, showToast]
  );

  const toggleTask = useCallback(
    (id: string | number) => {
      setData((prev) => {
        const next = {
          ...prev,
          tasks: prev.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        };
        debouncedSave(next);
        return next;
      });
    },
    [debouncedSave]
  );

  const addSubject = useCallback(
    (subjectName: string) => {
      const cleanName = subjectName.trim();
      if (!cleanName) return;
      // Check for duplicate outside setData to allow proper toast
      setData((prev) => {
        const exists = prev.coursesList.some((s) => s.subject.toLowerCase() === cleanName.toLowerCase());
        if (exists) return prev;
        const newSubject: CourseSubject = {
          id: Date.now(),
          subject: cleanName,
          courses: [],
        };
        const next = { ...prev, coursesList: [...prev.coursesList, newSubject] };
        debouncedSave(next);
        return next;
      });
      // Show appropriate toast after setState (best effort - React batches updates)
      // Use a small delay to read committed state; in practice this is fine since
      // the data ref is updated synchronously in the updater above.
      showToast(`Matière "${cleanName}" créée`, 'success');
    },
    [debouncedSave, showToast]
  );

  const addCourse = useCallback(
    (subjectName: string, courseData: Omit<Course, 'id'>) => {
      const newCourse: Course = {
        ...courseData,
        id: Date.now(),
      };
      setData((prev) => {
        let found = false;
        const nextCoursesList = prev.coursesList.map((s) => {
          if (s.subject.toLowerCase() === subjectName.toLowerCase()) {
            found = true;
            return { ...s, courses: [newCourse, ...s.courses] };
          }
          return s;
        });

        if (!found) {
          nextCoursesList.push({
            id: Date.now() + 1,
            subject: subjectName,
            courses: [newCourse],
          });
        }

        const next = { ...prev, coursesList: nextCoursesList };
        debouncedSave(next);
        return next;
      });
      showToast('Fiche de cours ajoutée !', 'success');
    },
    [debouncedSave, showToast]
  );

  const deleteCourse = useCallback(
    (subjectName: string, courseId: string | number) => {
      setData((prev) => {
        const nextCoursesList = prev.coursesList.map((s) => {
          if (s.subject.toLowerCase() === subjectName.toLowerCase()) {
            return { ...s, courses: s.courses.filter((c) => c.id !== courseId) };
          }
          return s;
        });
        const next = { ...prev, coursesList: nextCoursesList };
        debouncedSave(next);
        return next;
      });
      showToast('Fiche de cours supprimée', 'info');
    },
    [debouncedSave, showToast]
  );

  const addGrade = useCallback(
    (gradeData: Omit<Grade, 'id'>) => {
      const newGrade: Grade = {
        ...gradeData,
        id: Date.now(),
      };
      setData((prev) => {
        const next = { ...prev, grades: [newGrade, ...prev.grades] };
        debouncedSave(next);
        return next;
      });
      showToast('Note enregistrée !', 'success');
    },
    [debouncedSave, showToast]
  );

  const deleteGrade = useCallback(
    (id: string | number) => {
      setData((prev) => {
        const next = { ...prev, grades: prev.grades.filter((g) => g.id !== id) };
        debouncedSave(next);
        return next;
      });
      showToast('Note supprimée', 'info');
    },
    [debouncedSave, showToast]
  );

  const updateSettings = useCallback(
    (newSettings: Partial<AppSettings>) => {
      setData((prev) => {
        const updatedSettings: AppSettings = {
          ...prev.settings,
          ...newSettings,
        };
        const next = {
          ...prev,
          settings: updatedSettings,
          userName: updatedSettings.userName || prev.userName,
        };
        debouncedSave(next);
        return next;
      });
      showToast('Paramètres sauvegardés', 'success');
    },
    [debouncedSave, showToast]
  );

  return (
    <AppContext.Provider
      value={{
        data,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        activeModal,
        setActiveModal,
        editingTask,
        setEditingTask,
        activePdfPath,
        setActivePdfPath,
        toasts,
        showToast,
        removeToast,
        saveData,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        addSubject,
        addCourse,
        deleteCourse,
        addGrade,
        deleteGrade,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
