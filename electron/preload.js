const { contextBridge, ipcRenderer } = require('electron');

// Безопасный API для взаимодействия между главным процессом и рендерером
contextBridge.exposeInMainWorld('electronAPI', {
  // Примеры методов для взаимодействия с Electron
  getVersion: () => process.versions.electron,
  getPlatform: () => process.platform,
  
  // Методы для работы с файловой системой
  openFile: () => ipcRenderer.invoke('dialog-open-file'),
  saveFile: (content) => ipcRenderer.invoke('dialog-save-file', content),
  loadJsonFile: (filePath) => ipcRenderer.invoke('load-json-file', filePath),
  saveJsonFile: (filePath, data) => ipcRenderer.invoke('save-json-file', filePath, data),
  getDefaultFilePath: () => ipcRenderer.invoke('get-default-file-path'),
  setDefaultDatabase: (filePath) => ipcRenderer.invoke('set-default-database', filePath),
  getSavedDefaultDatabase: () => ipcRenderer.invoke('get-saved-default-database'),
  
  // Слушатели событий
  onMenuAction: (callback) => ipcRenderer.on('menu-action', callback),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

// Логирование для отладки
console.log('Preload script loaded successfully');
