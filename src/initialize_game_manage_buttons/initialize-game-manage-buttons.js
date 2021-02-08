ipcRenderer.send('initialize_game_manage_buttons');

ipcRenderer.on('initialize_game_manage_buttons', (arg) => {
    const downloadButton = document.getElementById("download-button");
    const downloadedManageButtons = document.getElementById("downloaded-manage-buttons");

    ipcRenderer.removeAllListeners('initialize_game_manage_buttons');
    if (arg.exists) {
        downloadButton.style.visibility = "hidden";
        downloadedManageButtons.style.visibility = "visible";
    } else {
        downloadButton.style.visibility = "visible";
        downloadedManageButtons.style.visibility = "hidden";
    }
});