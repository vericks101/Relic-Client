const { remote, ipcRenderer } = require("electron");

// Gets the current browser window instance.
function getCurrentWindow() {
  return remote.getCurrentWindow();
}

// Opens the menu display when the user clicks.
function openMenu(x, y) {
  ipcRenderer.send(`display-app-menu`, { x, y });
}

// When the user clicks the minimize button, minimize the window.
function minimizeWindow(browserWindow = getCurrentWindow()) {
  if (browserWindow.minimizable) {
    // browserWindow.isMinimizable() for old electron versions
    browserWindow.minimize();
  }
}

// When the user clicks the maximize button, maximize the window.
function maximizeWindow(browserWindow = getCurrentWindow()) {
  if (browserWindow.maximizable) {
    // browserWindow.isMaximizable() for old electron versions
    browserWindow.maximize();
  }
}

// When the user clicks the unmaximize button, unmaximize the window.
function unmaximizeWindow(browserWindow = getCurrentWindow()) {
  browserWindow.unmaximize();
}

// When the user clicks the close button, close the window.
function closeWindow(browserWindow = getCurrentWindow()) {
  browserWindow.close();
}

// Returns whether the current screen is maximized or not.
function isWindowMaximized(browserWindow = getCurrentWindow()) {
  return browserWindow.isMaximized();
}

module.exports = {
  getCurrentWindow,
  openMenu,
  minimizeWindow,
  maximizeWindow,
  unmaximizeWindow,
  isWindowMaximized,
  closeWindow,
};