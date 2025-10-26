// Основные типы данных приложения

export interface Snippet {
  id: number;
  title: string;
  code: string;
  notes: string;
  language: string;
  category: string;
  tags: string[];
  date: string;
  views: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export interface AppSettings {
  defaultDatabase?: string;
  lastSync?: string;
  theme?: 'dark' | 'light';
  autoSave?: boolean;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: string | null;
  pendingChanges: boolean;
  error?: string;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  apiKey: string;
  enabled: boolean;
}

export interface DatabaseConfig {
  local: {
    path: string;
    enabled: boolean;
  };
  googleSheets: GoogleSheetsConfig;
}

// Типы для компонентов (определены в локальных файлах компонентов)

// Типы для Electron API
export interface ElectronAPI {
  getVersion: () => string;
  getPlatform: () => string;
  openFile: () => Promise<string | null>;
  saveFile: (content: string) => Promise<boolean>;
  loadJsonFile: (filePath: string) => Promise<{ success: boolean; data?: Snippet[]; error?: string }>;
  saveJsonFile: (filePath: string, data: Snippet[]) => Promise<{ success: boolean; error?: string }>;
  getDefaultFilePath: () => Promise<string>;
  setDefaultDatabase: (filePath: string) => Promise<{ success: boolean; error?: string }>;
  getSavedDefaultDatabase: () => Promise<string | null>;
  onMenuAction: (callback: (event: any, action: string) => void) => void;
  removeAllListeners: (channel: string) => void;
}

// Расширение глобального объекта Window
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
