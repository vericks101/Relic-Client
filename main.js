const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
var path = require('path');
const { menu } = require('./src/menu/menu');
const { download } = require("electron-dl");

let mainWindow;

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
  
  mainWindow.setResizable(false);
  mainWindow.webContents.openDevTools()
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    // const log = require('electron-log');
    // log.transports.file.level = 'debug';
    // autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  });

  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url);
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on(`display-app-menu`, function(e, args) {
  if (mainWindow) {
    menu.popup({
      window: mainWindow,
      x: args.x,
      y: args.y
    });
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('initialize_game_manage_buttons', (event, info) => {
  var fs = require('fs');
  var filepath = `${app.getPath('userData')}\\${info.currentTab}`;

  if (fs.existsSync(filepath)) {
    event.sender.send('initialize_game_manage_buttons', { exists: true });
  } else {
    event.sender.send('initialize_game_manage_buttons', { exists: false });
  }
});

ipcMain.on('delete_game', (event, info) => {
  var fs = require('fs');
  var filepath = `${app.getPath('userData')}\\${info.currentTab}`;

  if (fs.existsSync(filepath)) {
      fs.rmdir(filepath, { recursive: true }, (err) => {
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

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});

ipcMain.on("download", (event, info) => {
  info.properties.onProgress = status => mainWindow.webContents.send("download progress", status);
  download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
      .then(dl => mainWindow.webContents.send("download complete", dl.getSavePath(), info.extractingFileName))
      .catch(err => {
        console.log(err);
        event.sender.send('download-error');
        return;
      });
});

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

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});

autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});