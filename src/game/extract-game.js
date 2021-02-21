ipcRenderer.on("extracting-progress", (event, progress) => {
    const progressElement = document.getElementById(`${currentTab}-progress-bar`);

    progressElement.style.width = progress.currentProgress + "%";
    progressElement.innerText = progress.currentProgress + "%";
});

ipcRenderer.on("extracting-finished", (event) => {
    const progressElement = document.getElementById(`${currentTab}-progress-bar`);

    progressElement.style.width = "0%";

    downloadGameVersion(UNBOUND_VERSION_URL);
});

ipcRenderer.on("extracting-error", (event) => {
    const downloadButton = document.getElementById(`${currentTab}-download-button`);
    const progressSection = document.getElementById(`${currentTab}-progress-section`);

    showErrorSnackbar('Error occurred while extracting game...');

    progressSection.style.visibility = "hidden";
    downloadButton.innerText = "Download";
    downloadButton.disabled = false;
});