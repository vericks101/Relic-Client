ipcRenderer.send('initialize_game_manage_buttons', {
    currentTab: currentTab
});

ipcRenderer.on('initialize_game_manage_buttons', (event, arg) => {
    const downloadButton = document.getElementById(`${currentTab}-download-button`);
    const downloadedManageButtons = document.getElementById(`${currentTab}-downloaded-manage-buttons`);

    ipcRenderer.removeAllListeners('initialize_game_manage_buttons');

    if (arg.exists) {
        downloadButton.style.visibility = "hidden";
        downloadedManageButtons.style.visibility = "visible";
    } else {
        downloadButton.style.visibility = "visible";
        downloadedManageButtons.style.visibility = "hidden";
    }
});