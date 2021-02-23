const { remote } = require("electron");
const {
  getCurrentWindow,
  openMenu,
  minimizeWindow,
  isWindowMaximized,
  closeWindow,
} = require("./menu-functions");

window.addEventListener("DOMContentLoaded", () => {
  window.getCurrentWindow = getCurrentWindow;
  window.openMenu = openMenu;
  window.minimizeWindow = minimizeWindow;
  window.isWindowMaximized = isWindowMaximized;
  window.closeWindow = closeWindow;
});