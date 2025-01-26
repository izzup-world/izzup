import { app, BrowserWindow, ipcMain } from 'electron'
import { initialize, enable } from '@electron/remote/main/index.js'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

initialize()

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

const currentDir = fileURLToPath(new URL('.', import.meta.url))

let mainWindow

function handleSetTitle (event, title) {
  console.log('TEST')
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    // frame: false,
    webPreferences: {
      sandbox: false, // <-- to be able to import @electron/remote in preload script
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
      )
    }
  })

  enable(mainWindow.webContents)

  if (process.env.DEV) {
    mainWindow.loadURL(process.env.APP_URL)
  } else {
    mainWindow.loadFile('index.html')
  }

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

}

app.whenReady().then(()=> {
  ipcMain.on('set-title', handleSetTitle)
  createWindow()
})


app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
