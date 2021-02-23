// Sends a request off to the main process to launch the current
// tab's game.
function launchGame() {
    ipcRenderer.send("launch_game", {
        currentTab: currentTab
    });
}

// Update the error snackbar if there is an issue launching the current
// tab's game.
ipcRenderer.on("launch_game_error", () => {
    showErrorSnackbar('Error occurred while launching game...');
});