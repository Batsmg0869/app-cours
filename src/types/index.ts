export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string | number;
  title: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  description?: string;
  completed: boolean;
  attachment?: string;
  createdAt?: string;
}

export interface Course {
  id: string | number;
  title: string;
  description?: string;
  pdf?: string;
  date: string;
}

export interface CourseSubject {
  id: string | number;
  subject: string;
  courses: Course[];
}

export interface Grade {
  id: string | number;
  subject: string;
  value: number;
  max?: number;
  weight: number;
  title?: string;
  trimester?: 'T1' | 'T2' | 'T3' | 'S1' | 'S2' | 'ALL';
  date: string;
}

export interface TimetableSlot {
  id: string | number;
  day: 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi';
  startTime: string;
  endTime: string;
  subject: string;
  room?: string;
  color?: string;
}

export interface AppSettings {
  userName: string;
  theme: string;
  darkMode: boolean;
  fontFamily: 'inter' | 'minecraft';
  highPriority: boolean;
  notificationsEnabled: boolean;
  notificationTime: string;
  targetAverage?: number;
  selectedTrimester?: string;
  onboardingCompleted?: boolean;
}

export interface AppData {
  tasks: Task[];
  courses?: Course[];
  coursesList: CourseSubject[];
  grades: Grade[];
  timetable?: TimetableSlot[];
  settings: AppSettings;
  userName?: string;
}

export interface GitHubUpdateInfo {
  tagName: string;
  name?: string;
  url: string;
  assetUrl?: string;
}

export interface ReleaseAssetInfo {
  id: number;
  tagName: string;
  name: string;
  publishedAt: string;
  body: string;
  htmlUrl: string;
  url?: string;
  assetUrl?: string | null;
  assetName?: string | null;
  assetSize?: number | null;
}

export interface DownloadProgress {
  percent: number;
  receivedBytes: number;
  totalBytes: number;
  versionName?: string;
}

declare global {
  interface Window {
    storage: {
      isWindows: boolean;
      save: (data: AppData) => Promise<boolean>;
      load: () => Promise<AppData>;
      setAppPriority: (enabled: boolean) => Promise<boolean>;
      openPDF: (pdfPath: string) => Promise<boolean>;
      loadPDF: (pdfPath: string) => Promise<string | null>;
      downloadPDF: (pdfPath: string) => Promise<boolean>;
      exportData: () => Promise<boolean>;
      importData: () => Promise<AppData | null>;
      saveAttachment: (data: { filePath?: string; fileName?: string; content?: string; name?: string }) => Promise<{ success: boolean; path?: string; fileName?: string; error?: string }>;
      openAttachment: (path: string) => Promise<boolean>;
      exportICS: (events: unknown[]) => Promise<boolean>;
    };
    updater: {
      checkForUpdates: () => void;
      installUpdate: () => void;
      getAppVersion: () => Promise<string>;
      getReleases: () => Promise<ReleaseAssetInfo[]>;
      downloadUpdate: (data: { url: string; fileName?: string; versionName?: string }) => Promise<{ success: boolean; filePath?: string; versionName?: string; error?: string }>;
      installDownloadedUpdate: (data: { filePath: string; versionName?: string }) => Promise<{ success: boolean; error?: string }>;
      openExternal: (url: string) => Promise<boolean>;
      onUpdateStatus: (callback: (message: string) => void) => void;
      onUpdateDownloaded: (callback: (releaseName: string) => void) => void;
      onGithubUpdateAvailable: (callback: (info: GitHubUpdateInfo) => void) => void;
      onDownloadProgress: (callback: (progress: DownloadProgress) => void) => void;
    };
  }
}
