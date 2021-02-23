// Updates current extraction UI as the game files are being extracted.
ipcRenderer.on("extracting-progress", (event, progress) => {
    const progressElement = document.getElementById(`${currentTab}-progress-bar`);

    progressElement.style.width = progress.currentProgress + "%";
    progressElement.innerText = progress.currentProgress + "%";
});

// Updates current extraction UI as the game files finish being extracted.
ipcRenderer.on("extracting-finished", (event) => {
    const progressElement = document.getElementById(`${currentTab}-progress-bar`);

    progressElement.style.width = "0%";

    downloadGameVersion(UNBOUND_VERSION_URL);
});

// Displays an error via the error snackbar if there is an issue extracting the
// current tab's game files.
ipcRenderer.on("extracting-error", (event) => {
    const downloadButton = document.getElementById(`${currentTab}-download-button`);
    const progressSection = document.getElementById(`${currentTab}-progress-section`);

    showErrorSnackbar('Error occurred while extracting game...');

    progressSection.style.visibility = "hidden";
    downloadButton.innerText = "Download";
    downloadButton.disabled = false;
});