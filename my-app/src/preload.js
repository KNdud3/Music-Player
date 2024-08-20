const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  ping: () => ipcRenderer.invoke('ping'),
  getDirectoryFiles: (dirPath) => ipcRenderer.invoke('getDirectoryFiles', dirPath),
  selectAndCopyFiles: () => ipcRenderer.invoke('selectAndCopyFiles'),
  registerUser: (username, password) => ipcRenderer.invoke('registerUser', username, password),
  loginUser: (username, password) => ipcRenderer.invoke('loginUser', username, password)

})