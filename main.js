const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
var path = require('path');
const { menu } = require('./src/menu/menu');
const { download } = require("electron-dl");

let mainWindow;

// Creates main application window.
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "./src/menu/menu-preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true
    },
    frame: false
  });
  
  // Enable for browser development tools.
  // mainWindow.webContents.openDevTools();

  mainWindow.setResizable(false);
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Once the main application window has loaded, check for client updates.
  mainWindow.once('ready-to-show', () => {
    // Enable for auto update logs for debugging.
    // const log = require('electron-log');
    // log.transports.file.level = 'debug';
    // autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  });

  // When a new window event is fired, open it in a browser tab instead of within the application.
  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });
}

// When the application starts, create a main window.
app.on('ready', () => {
  createWindow();
});

// Quit the application when the main window is closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Create the main window when the application is activated.
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Create and display the custom main window menu options.
ipcMain.on(`display-app-menu`, function(e, args) {
  if (mainWindow) {
    menu.popup({
      window: mainWindow,
      x: args.x,
      y: args.y
    });
  }
});

// Gets the current app version and sends it off to the current renderer process.
ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

// Checks the file system for the current tab's game on whether it's installed or not
// and returns the status back to the initialize game manage buttons logic.
ipcMain.on('initialize_game_manage_buttons', (event, info) => {
  var fs = require('fs');
  var filepath = `${app.getPath('userData')}\\${info.currentTab}`;

  if (fs.existsSync(filepath)) {
    event.sender.send('initialize_game_manage_buttons', { exists: true });
  } else {
    event.sender.send('initialize_game_manage_buttons', { exists: false });
  }
});

// Checks file system for current tab's installed game and deletes its contents.
ipcMain.on('delete_game', (event, info) => {
  var fs = require('fs');
  var existingFolderPath = `${app.getPath('userData')}\\${info.currentTab}`;

  if (fs.existsSync(existingFolderPath)) {
      fs.rmdir(existingFolderPath, { recursive: true }, (err) => {
          if (err) {
              console.log("An error ocurred updating the folder" + err.message);
              console.log(err);
              event.sender.send('game_deleted_error');
              return;
          }
          console.log("Folder succesfully deleted");
          event.sender.send('game_deleted');
      });
  } else {
      console.log("This folder doesn't exist, cannot delete");
      event.sender.send('game_deleted_error');
  }
});

// Attempts to open the current tab's game.
ipcMain.on('launch_game', (event, info) => {
  var child = require('child_process').execFile;
  var executablePath = `${app.getPath('userData')}\\${info.currentTab}\\${info.currentTab}.exe`;
  child(executablePath, function(err, data) {
    if(err){
       console.error(err);
       event.sender.send('launch_game_error');
       return;
    }
 
    console.log(data.toString());
  });
});

// Takes in the current tab and attempts to download the game to the file system.
ipcMain.on("download-game", (event, info) => {
  var fs = require('fs');
  var existingFolderPath = `${app.getPath('userData')}\\${info.currentTab}`;
  if (fs.existsSync(existingFolderPath)) {
    fs.rmdir(existingFolderPath, { recursive: true }, (err) => {
      if (err) {
          console.log("An error ocurred updating the folder" + err.message);
          console.log(err);
          event.sender.send('game_deleted_error');
          return;
      }
      console.log("Folder succesfully deleted");
    });
  }

  info.properties.onProgress = status => mainWindow.webContents.send("download-game-progress", status);
  download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
      .then(dl => mainWindow.webContents.send("download-game-complete", dl.getSavePath(), info.extractingFileName))
      .catch(err => {
        console.log(err);
        event.sender.send('download-game-error');
        return;
      });
});

// Takes in the current tab's downloaded game and downloads the current version file.
ipcMain.on("download-game-version", (event, info) => {
  info.properties.onProgress = status => mainWindow.webContents.send("download-game-version-progress", status);
  download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
      .then(dl => mainWindow.webContents.send("download-game-version-complete", dl.getSavePath()))
      .catch(err => {
        console.log(err);
        event.sender.send('download-game-version-error');
        return;
      });
});

// For the current tab, downloads the most recent game version file to compare against.
ipcMain.on("check-for-game-updates", (event, info) => {
  info.properties.onProgress = status => mainWindow.webContents.send("check-for-game-updates-progress", status);
  download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
      .then(dl => mainWindow.webContents.send("check-for-game-updates-complete", dl.getSavePath()))
      .catch(err => {
        console.log(err);
        event.sender.send('check-for-game-updates-error');
        return;
      });
});

// For the current tab, takes in the current game version file and compares it against the
// most recent game version file. If they aren't the same, call for the newest game version
// to be downloaded and installed.
ipcMain.on('compare-game-versions', (event, info) => {
  var fs = require('fs');
  var existingVersionFilePath = `${app.getPath('userData')}\\${info.currentTab}\\${info.versionFileName}`;
  var newestVersionFilePath = `${app.getPath('userData')}\\${info.versionFileName}`;
  fs.readFile(existingVersionFilePath, 'utf-8', (err, existingVersion) => {
    if(err){
      console.log(err);
      event.sender.send('compare-game-versions-error');
      return;
    }

    fs.readFile(newestVersionFilePath, 'utf-8', (err, newestVersion) => {
      if(err){
        console.log(err);
        event.sender.send('compare-game-versions-error');
        return;
      }

      if (fs.existsSync(newestVersionFilePath)) {
          fs.unlink(newestVersionFilePath, (err) => {
              if (err) {
                  console.log("An error ocurred updating the file" + err.message);
                  console.log(err);
                  event.sender.send('compare-game-versions-error');
                  return;
              }
              console.log("File succesfully deleted");
          });
      } else {
          console.log("This file doesn't exist, cannot delete");
          event.sender.send('compare-game-versions-error');
      }

      event.sender.send('compare-game-versions-complete', { updateNeeded: existingVersion !== newestVersion });
    });
  });
});

// For the current tab, takes in the downloaded game and attempts to decompress the files.
ipcMain.on('decompress-files', (event, info) => {
  var DecompressZip = require('decompress-zip');
  var ZIP_FILE_PATH = `${app.getPath('userData')}\\${info.extractingFileName}`;
  var DESTINATION_PATH = `${app.getPath('userData')}`;
  var unzipper = new DecompressZip(ZIP_FILE_PATH);

  unzipper.on('error', function (err) {
    console.log('Caught an error', err);
    event.sender.send('extracting-error');
  });

  unzipper.on('extract', function (log) {
    console.log('Finished extracting', log);

    var fs = require('fs');
    var filepath = `${app.getPath('userData')}\\${info.extractingFileName}`;
    if (fs.existsSync(filepath)) {
        fs.unlink(filepath, (err) => {
            if (err) {
                console.log("An error ocurred updating the file" + err.message);
                console.log(err);
                event.sender.send('extracting-error');
                return;
            }
            console.log("File succesfully deleted");
        });
    } else {
        console.log("This file doesn't exist, cannot delete");
        event.sender.send('extracting-error');
    }

    event.sender.send('extracting-finished');
  });

  unzipper.on('progress', function (fileIndex, fileCount) {
    console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
    const currentProgress = Math.floor(((fileIndex + 1) / fileCount) * 100);
    event.sender.send('extracting-progress', { currentProgress: currentProgress });
  });

  unzipper.extract({
    path: DESTINATION_PATH
  });
});

// If there is a client update available and the user decides to restart the app,
// call the auto updater to quit and install the new client update.
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

// If there is a client update available, send to the renderer process to prompt the user.
autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
});

// If a client update has been downloaded, prompt the user to see if a restart is wanted or not.
autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});