import { app, BrowserWindow, ipcMain, shell } from 'electron'

export function registerSystemHandlers() {
  ipcMain.handle('system:reload', () => {
    app.relaunch()
    app.quit()
  })

  ipcMain.handle('system:open-external', (_, url: string) => {
    shell.openExternal(url)
  })

  ipcMain.handle('system:toggle-devtools', () => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      focusedWindow.webContents.toggleDevTools()
    }
  })
}
