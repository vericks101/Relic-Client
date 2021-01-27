const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
var path = require('path');
const { menu } = require('./menu');
// const { download } = require("electron-dl");

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true
    },
    frame: false
  });
  // mainWindow.webContents.openDevTools()
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });

  // var child = require('child_process').execFile;
  // var executablePath = "C:\\Program Files (x86)\\Alien Invasion\\Alien Invasion x86.exe";
  // child(executablePath, function(err, data) {
  //   if(err){
  //      console.error(err);
  //      return;
  //   }
 
  //   console.log(data.toString());
  // });

  // var fs = require('fs');
  // var filepath = "C:\\Users\\veric\\Desktop\\test1.txt";

  // if (fs.existsSync(filepath)) {
  //     fs.unlink(filepath, (err) => {
  //         if (err) {
  //             console.log("An error ocurred updating the file" + err.message);
  //             console.log(err);
  //             return;
  //         }
  //         console.log("File succesfully deleted");
  //     });
  // } else {
  //     console.log("This file doesn't exist, cannot delete");
  // }
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

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});

// ipcMain.on("download", (event, info) => {
//   info.properties.onProgress = status => mainWindow.webContents.send("download progress", status);
//   download(BrowserWindow.getFocusedWindow(), info.url, info.properties)
//       .then(dl => mainWindow.webContents.send("download complete", dl.getSavePath()));
// });

autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});