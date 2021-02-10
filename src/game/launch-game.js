function launchGame() {
    ipcRenderer.send("launch_game", {
        currentTab: currentTab
    });
}

ipcRenderer.on("launch_game_error", () => {
    showErrorSnackbar('Error occurred while launching game...');
});