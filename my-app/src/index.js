const { app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('node:path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const db = require('./database');


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
ipcMain.handle('getDirectoryFiles', async (event) => {
  try {
    createDirectories();
    const files = fs.readdirSync('src/songs');
    return files;
  } 
  catch (error) {
    return {error: error.message};
  }
});


// Helper function to resolve file name conflicts (used when adding files)
function getUniqueFileName(directory, fileName) {
  let baseName = path.basename(fileName, path.extname(fileName));
  let extension = path.extname(fileName);
  let newFileName = fileName;
  let counter = 1; // Counter is the nuymber added to end of the file

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
    filters: [{name: 'Music Files', extensions: ['mp3','wav','ogg']}],
  });

  if (result.canceled) {
    return { canceled: true };
  } else {
    createDirectories();
    const destinationDir = 'src/songs';
    try {
      result.filePaths.forEach(filePath => {
        const fileName = path.basename(filePath);
        const uniqueFileName = getUniqueFileName(destinationDir, fileName);
        const destinationPath = path.join(destinationDir, uniqueFileName);
        fs.copyFileSync(filePath, destinationPath);
      });
      return {canceled: false, filePaths: result.filePaths};
    } 
    catch (error) {
      return {error: error.message};
    }
  }
});

// Helper function to create directories if they do not exist
const createDirectories = async () => {
  const dirPath = path.join(__dirname, 'src', 'songs');

  try {
    await fs.promises.mkdir(dirPath, {recursive: true});
  } 
  catch (err) {
    console.error('Error creating directories:', err);
  }
};

// Handle user registration
ipcMain.handle('registerUser', async (event, usern, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db('users').insert({ username: `${usern}`, password: hashedPassword });
    return {success: true};
  } 

  catch (error) {
    if (error.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed')){
      return { success: false, error: 'Username taken'};
    }
    return {success: false, error: error.message};
  }
});

// Handle user login
ipcMain.handle('loginUser', async (event, username, password) => {
  try {
    const user = await db('users').where({ username }).first();
    if (!user) {
      return {success: false, error: 'User not found'};
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return {success: false, error: 'Incorrect password'};
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});