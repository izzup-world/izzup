/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.js you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */
import { contextBridge, ipcRenderer } from 'electron'
import { BrowserWindow } from '@electron/remote'
import { dialog } from '@electron/remote'


contextBridge.exposeInMainWorld('izzupAPI', {
  minimize () {
    BrowserWindow.getFocusedWindow().minimize()
  },

  toggleMaximize () {
    const win = BrowserWindow.getFocusedWindow()

    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  },

  close () {
    BrowserWindow.getFocusedWindow().close()
  },

  // async openFileDialog (title, folder, filters) {
  //   const response = await dialog.showOpenDialog({
  //     title,
  //     filters,
  //     properties: ['openFile', 'multiSelections'],
  //   });
  //   return response.filePaths;
  // },

  setTitle (title) {
    console.log(`TITLE ${title}`)
    ipcRenderer.send('set-title', title)
  },

  async openContentDir () {
    console.log('Preload - Opening content dir')
    const response = await dialog.showOpenDialog({
      title: 'Izzup content directory',
      properties: ['openDirectory'],
    });
    const selectedDir = response.filePaths[0]
    ipcRenderer.send('open-content-dir', selectedDir)
  },

  openFile: () => ipcRenderer.invoke('dialog:openFile'),

  onOpenContentDir: (callback) => ipcRenderer.on('open-content-dir', (_event, value) => callback(value)),
  onUpdateCounter: (callback) => ipcRenderer.on('update-counter', (_event, value) => callback(value)),
  counterValue: (value) => ipcRenderer.send('counter-value', value)

})