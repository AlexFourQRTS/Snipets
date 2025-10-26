const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = process.env.NODE_ENV === 'development';

// Создание главного окна приложения
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: true,
    titleBarStyle: 'default',
    backgroundColor: '#000000', // Черная рамка
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../../icon.png'),
    show: false // Не показывать окно до полной загрузки
  });

  // Загрузка React приложения - всегда из собранных файлов
  const buildPath = path.join(__dirname, 'index.html');
  console.log('Загружаем собранное приложение:', buildPath);
  mainWindow.loadFile(buildPath);

  // Показать окно когда оно готово
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Обработка закрытия окна
  mainWindow.on('closed', () => {
    // В macOS приложения обычно остаются активными до явного выхода
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  return mainWindow;
}

// Этот метод будет вызван когда Electron закончит инициализацию
app.whenReady().then(() => {
  createWindow();

  // На macOS пересоздать окно при клике на иконку в dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Выход когда все окна закрыты (кроме macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Убираем стандартное меню
Menu.setApplicationMenu(null);

// Создаем контекстное меню
const contextMenuTemplate = [
  {
    label: 'Перезагрузить',
    accelerator: 'CmdOrCtrl+R',
    click: (item, focusedWindow) => {
      if (focusedWindow) focusedWindow.reload();
    }
  },
  {
    label: 'Полноэкранный режим',
    accelerator: process.platform === 'darwin' ? 'Ctrl+Cmd+F' : 'F11',
    click: (item, focusedWindow) => {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    }
  },
  { type: 'separator' },
  {
    label: 'Инструменты разработчика',
    accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
    click: (item, focusedWindow) => {
      if (focusedWindow) focusedWindow.toggleDevTools();
    }
  },
  { type: 'separator' },
  {
    label: 'Выход',
    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
    click: () => {
      app.quit();
    }
  }
];

// Создаем контекстное меню
const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);

// Добавляем обработчик контекстного меню
app.on('web-contents-created', (event, contents) => {
  contents.on('context-menu', (event, params) => {
    contextMenu.popup();
  });
});

// Глобальная переменная для главного окна
let mainWindow;

// Обработчик для загрузки JSON файлов
ipcMain.handle('load-json-file', async (event, filePath) => {
  try {
    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error('Файл не найден');
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    
    // Проверяем, что файл не пустой
    if (!data.trim()) {
      throw new Error('Файл пустой - будет заполнен данными по умолчанию');
    }
    
    const jsonData = JSON.parse(data);
    
    if (!Array.isArray(jsonData)) {
      throw new Error('JSON файл должен содержать массив сниппетов');
    }
    
    return { success: true, data: jsonData };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Обработчик для диалога выбора файла
ipcMain.handle('dialog-open-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Обработчик для сохранения JSON файла
ipcMain.handle('save-json-file', async (event, filePath, data) => {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonString, 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Обработчик для получения пути к дефолтному файлу
ipcMain.handle('get-default-file-path', () => {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'snippets.json');
});

// Обработчик для сохранения пути к базе по умолчанию
ipcMain.handle('set-default-database', async (event, filePath) => {
  try {
    const userDataPath = app.getPath('userData');
    const configPath = path.join(userDataPath, 'snipets-config.json');
    
    const config = {
      defaultDatabase: filePath,
      lastUpdated: new Date().toISOString()
    };
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Обработчик для получения сохраненного пути к базе по умолчанию
ipcMain.handle('get-saved-default-database', async () => {
  try {
    const userDataPath = app.getPath('userData');
    const configPath = path.join(userDataPath, 'snipets-config.json');
    
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configData);
      return config.defaultDatabase || null;
    }
    return null;
  } catch (error) {
    console.error('Error reading saved database path:', error);
    return null;
  }
});
