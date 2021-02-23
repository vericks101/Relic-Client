// Sends of a request to the main process to download the current tab's
// game and displays as such via the UI.
function downloadGame(downloadUrl, extractingFileName) {
    const progressSection = document.getElementById(`${currentTab}-progress-section`);
    const progressElement = document.getElementById(`${currentTab}-progress-bar`);
    const downloadButton = document.getElementById(`${currentTab}-download-button`);

    progressElement.style.width = "0%";
    progressSection.style.visibility = "visible";
    downloadButton.innerText = "Downloading Game...";
    downloadButton.disabled = true;

    ipcRenderer.send("download-game", {
        currentTab: currentTab,
        url: downloadUrl,
        extractingFileName: extractingFileName,
        properties: {directory: `${remote.app.getPath('userData')}`}
    });
}

// Updates game download progress UI as the download is progressing.
ipcRenderer.on("download-game-progress", (event, progress) => {
    const progressElement = document.getElementById(`${currentTab}-progress-bar`);
    const cleanProgressInPercentages = Math.floor(progress.percent * 100);

    progressElement.style.width = cleanProgressInPercentages + "%";
    progressElement.innerText = cleanProgressInPercentages + "%";
});

// Updates game download UI as the download completes.
ipcRenderer.on("download-game-complete", (event, file, extractingFileName) => {
    const progressElement = document.getElementById(`${currentTab}-progress-bar`);
    const downloadButton = document.getElementById(`${currentTab}-download-button`);

    downloadButton.innerText = "Extracting Game...";
    progressElement.style.width = "0%";

    ipcRenderer.send("decompress-files", {
        extractingFileName: extractingFileName
    });
});

// If there is an error while downloading the current tab's game, display
// as so via the error snackbar.
ipcRenderer.on("download-game-error", (event) => {
    const progressSection = document.getElementById(`${currentTab}-progress-section`);
    const downloadButton = document.getElementById(`${currentTab}-download-button`);

    showErrorSnackbar('Error occurred while downloading game...');

    progressSection.style.visibility = "hidden";
    downloadButton.innerText = "Download";
    downloadButton.disabled = false;
});