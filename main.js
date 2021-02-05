const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
var path = require('path');
const { menu } = require('./menu');
const { download } = require("electron-dl");

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
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
    autoUpdater.checkForUpdatesAndNotify();
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

// Register an event listener. When ipcRenderer sends mouse click co-ordinates, show menu at that position.
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

ipcMain.on('initialize_game_manage_buttons', (event) => {
  var fs = require('fs');
  var filepath = "C:\\Users\\veric\\Desktop\\test\\Build\\";

  if (fs.existsSync(filepath)) {
    event.sender.send('initialize_game_manage_buttons', { exists: true });
  } else {
    event.sender.send('initialize_game_manage_buttons', { exists: false });
  }
});

ipcMain.on('delete_game', (event) => {
  var fs = require('fs');
  var filepath = "C:\\Users\\veric\\Desktop\\test\\Build\\";

  if (fs.existsSync(filepath)) {
      fs.rmdir(filepath, { recursive: true }, (err) => {
          if (err) {
              console.log("An error ocurred updating the folder" + err.message);
              console.log(err);
              return;
          }
          console.log("Folder succesfully deleted");
      });
  } else {
      console.log("This folder doesn't exist, cannot delete");
  }
});

ipcMain.on('launch_game', (event) => {
  var child = require('child_process').execFile;
  var executablePath = "C:\\Users\\veric\\Desktop\\test\\Build\\Unbound.exe";
  child(executablePath, function(err, data) {
    if(err){
       console.error(err);
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
      .then(dl => mainWindow.webContents.send("download complete", dl.getSavePath()));
});

ipcMain.on('decompress-files', (event) => {
  var DecompressZip = require('decompress-zip');
  var ZIP_FILE_PATH = "C:\\Users\\veric\\Desktop\\Build.zip";
  var DESTINATION_PATH = "C:\\Users\\veric\\Desktop\\test";
  var unzipper = new DecompressZip(ZIP_FILE_PATH);

  unzipper.on('error', function (err) {
    console.log('Caught an error', err);
  });

  unzipper.on('extract', function (log) {
    console.log('Finished extracting', log);

    var fs = require('fs');
    var filepath = "C:\\Users\\veric\\Desktop\\Build.zip";

    if (fs.existsSync(filepath)) {
        fs.unlink(filepath, (err) => {
            if (err) {
                console.log("An error ocurred updating the file" + err.message);
                console.log(err);
                return;
            }
            console.log("File succesfully deleted");
        });
    } else {
        console.log("This file doesn't exist, cannot delete");
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