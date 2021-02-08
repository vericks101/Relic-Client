function deleteGame() {
    ipcRenderer.send("delete_game");
}

ipcRenderer.on("game_deleted", (event) => {
    const downloadButton = document.getElementById("download-button");
    const downloadedManageButtons = document.getElementById("downloaded-manage-buttons");

    downloadedManageButtons.style.visibility = "hidden";
    downloadButton.style.visibility = "visible";
});

ipcRenderer.on("game_deleted_error", (event) => {
    showErrorSnackbar('Error occurred while removing game...');
});