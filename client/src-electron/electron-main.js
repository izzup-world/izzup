import { app, BrowserWindow, ipcMain, dialog, Menu } from 'electron'
import { initialize, enable } from '@electron/remote/main/index.js'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs';
import { fileURLToPath } from 'node:url'

import writeFileAtomic from 'write-file-atomic'

initialize()

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

const currentDir = fileURLToPath(new URL('.', import.meta.url))

// UTILITY FUNCTIONS

// const writeData = async (filename, data) => {
//   try {
//     await writeFileAtomic(filename, data);
//     console.log('File written successfully.');
//   } catch (err) {
//     console.error('Error writing file:', err);
//   }
// }

const writeDataSync = (filename, data) => {
  try {
    writeFileAtomic.sync(filename, data);
    console.log('File written successfully.');
  } catch (err) {
    console.error('Error writing file:', err); 
  }
}

const dirExistsSync = (dir) => {
  return fs.existsSync(dir)
}

const createDirSync = (dir) => {
  fs.mkdirSync(dir)
}

const getDirSync = (dir) => {
  return fs.readdirSync(dir)
}

// APP LOGIC
let uData
let appDir
let logFile 

let mainWindow

const logMsgSync = (msg) => {
  const logMsg = `${new Date().toISOString()} - ${msg}`
  console.log(`APPLOG: ${logMsg}`)
  fs.appendFile(logFile, `${logMsg}\n`, (err) => {
    if (err) {
      console.error('Error appending to file:', err)
      return
    } 
  })
}

const createManifest = (appDir) => {
  const info = { version: '1.0.0', vendor: 'Izzup', license: 'AGPL'}

  const infoPath = `${appDir}/izzup_info.json`

  writeDataSync(infoPath, info)

  logMsgSync(`Izzup info written: ${infoPath}`)
}

const initApp = () => {

  uData = app.getPath('userData')

  appDir = `${uData}/Izzup`

  logFile = `${appDir}/logs.txt`

  if(!dirExistsSync(appDir)) {
    createDirSync(appDir)
    logMsgSync(`Izzup app dir created at: ${appDir}`)
    createManifest(appDir) 
  }
}


// HANDLERS

const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}

const handleContentDirOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Izzup content directory',
    properties: ['openDirectory'],
  })
  if (!canceled) {
    return filePaths[0]
  }
}

const handleSetTitle = (event, title) => {
  console.log(`EVENT ${event}`)
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
}

const handleOpenContentDir = (event, dir) => {
  console.log('EVENT')
  console.log(event)
  console.log(`DIR ${dir}`)

  // Directory MUST be empty OR have an existing Izzup.manifest file
  const dirContents = getDirSync(dir)
  if(dirContents.includes('Izzup.manifest')) {
    // Use the directory
    logMsgSync(`INFO Existing manifest found in: ${dir}`)
    mainWindow.webContents.send('open-content-dir', dir)
  } else {
    // Empty? Create an Izzup.manifest and use the directory
    if(dirContents.length == 0) {
      console.log(`CREATE MANIFEST IN DIR ${dir}`)
      mainWindow.webContents.send('open-content-dir', dir)
    } else {
      // Else this in not a valid content directory
      logMsgSync(`ERROR! Directory already in use: ${dir}`)
      mainWindow.webContents.send('open-content-dir', dir)
    }

    
  }
}

// CREATE WINDOW

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
      // nodeIntegration: true,
      // enableRemoteModule: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
      )
    }
  })

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment'
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement'
        }
      ]
    }

  ])

  Menu.setApplicationMenu(menu)

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

  // Init app config and log activity
  initApp()
  logMsgSync('Izzup app started')

  // Register IPC message handlers
  ipcMain.on('set-title', handleSetTitle)
  ipcMain.on('open-content-dir', handleOpenContentDir)

  ipcMain.handle('dialog:openFile', handleFileOpen)

  ipcMain.handle('dialog:openContentDir', handleContentDirOpen)

  ipcMain.on('counter-value', (_event, value) => {
    console.log(value) // will print value to Node console
  })
  

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
