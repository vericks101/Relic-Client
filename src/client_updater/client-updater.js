ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    updateNotification.classList.remove('hidden');
});

ipcRenderer.on('update_downloaded', () => {
    const restartButton = document.getElementById('restart-button');

    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    updateNotification.classList.remove('hidden');
});