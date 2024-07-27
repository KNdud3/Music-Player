const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  ping: () => ipcRenderer.invoke('ping'),
  getDirectoryFiles: (dirPath) => ipcRenderer.invoke('get-directory-files', dirPath),
  selectAndCopyFiles: () => ipcRenderer.invoke('selectAndCopyFiles')
})