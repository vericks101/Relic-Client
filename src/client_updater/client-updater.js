// When there is a client update available, update the display message
// and unhide the update notification UI.
ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    updateNotification.classList.remove('hidden');
});

// When a client update has finished downloading, update the display message
// and display UI to allow the user to restart the application if that is desired.
ipcRenderer.on('update_downloaded', () => {
    const restartButton = document.getElementById('restart-button');

    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    updateNotification.classList.remove('hidden');
});