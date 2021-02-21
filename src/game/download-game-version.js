function downloadGameVersion(downloadVersionUrl) {
    const downloadButton = document.getElementById(`${currentTab}-download-button`);

    downloadButton.innerText = "Downloading Version...";

    ipcRenderer.send("download-game-version", {
        url: downloadVersionUrl,
        properties: {directory: `${remote.app.getPath('userData')}\\${currentTab}`}
    });
}

ipcRenderer.on("download-game-version-progress", (event, progress) => {
    const progressElement = document.getElementById(`${currentTab}-progress-bar`);
    const cleanProgressInPercentages = Math.floor(progress.percent * 100);

    progressElement.style.width = cleanProgressInPercentages + "%";
    progressElement.innerText = cleanProgressInPercentages + "%";
});

ipcRenderer.on("download-game-version-complete", (event) => {
    const downloadButton = document.getElementById(`${currentTab}-download-button`);
    const progressSection = document.getElementById(`${currentTab}-progress-section`);
    const progressElement = document.getElementById(`${currentTab}-progress-bar`);
    const downloadedManageButtons = document.getElementById(`${currentTab}-downloaded-manage-buttons`);

    progressSection.style.visibility = "hidden";
    downloadButton.style.visibility = "hidden";
    progressElement.style.width = "0%";
    downloadedManageButtons.style.visibility = "visible";
    downloadButton.innerText = "Download";
    downloadButton.disabled = false;
});

ipcRenderer.on("download-game-version-error", (event) => {
    const progressSection = document.getElementById(`${currentTab}-progress-section`);
    const downloadButton = document.getElementById(`${currentTab}-download-button`);

    showErrorSnackbar('Error occurred while downloading game version...');

    progressSection.style.visibility = "hidden";
    downloadButton.innerText = "Download";
    downloadButton.disabled = false;
});