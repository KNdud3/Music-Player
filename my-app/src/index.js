const { app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('node:path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Attatch to preload.js
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Used to get files from a specified directory
ipcMain.handle('get-directory-files', async (event, dirPath) => {
  try {
    const files = fs.readdirSync(dirPath);
    return files;
  } catch (error) {
    return { error: error.message };
  }
});


// Helper function to resolve file name conflicts
function getUniqueFileName(directory, fileName) {
  let baseName = path.basename(fileName, path.extname(fileName));
  let extension = path.extname(fileName);
  let newFileName = fileName;
  let counter = 1;

  while (fs.existsSync(path.join(directory, newFileName))) {
    newFileName = `${baseName} (${counter})${extension}`;
    counter++;
  }

  return newFileName;
}


// IPC handler to select and copy files to the songs directory
ipcMain.handle('selectAndCopyFiles', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Music Files', extensions: ['mp3', 'wav'] }],
  });

  if (result.canceled) {
    return { canceled: true };
  } else {
    const destinationDir = 'src/songs';
    try {
      result.filePaths.forEach(filePath => {
        const fileName = path.basename(filePath);
        const uniqueFileName = getUniqueFileName(destinationDir, fileName);
        const destinationPath = path.join(destinationDir, fileName);
        fs.copyFileSync(filePath, destinationPath);
      });
      return { canceled: false, filePaths: result.filePaths };
    } catch (error) {
      return { error: error.message };
    }
  }
});
