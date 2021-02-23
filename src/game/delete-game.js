// Sends a request to the main process to attempt to delete the current
// tab's game.
function deleteGame() {
    ipcRenderer.send("delete_game", {
        currentTab: currentTab
    });
}

// Once a game has been deleted, display the download button and hide 
// the manage buttons.
ipcRenderer.on("game_deleted", (event) => {
    const downloadButton = document.getElementById(`${currentTab}-download-button`);
    const downloadedManageButtons = document.getElementById(`${currentTab}-downloaded-manage-buttons`);

    downloadedManageButtons.style.visibility = "hidden";
    downloadButton.style.visibility = "visible";
});

// Display an error via the error snackbar if there was an error deleting
// the current tab's game.
ipcRenderer.on("game_deleted_error", (event) => {
    showErrorSnackbar('Error occurred while removing game...');
});