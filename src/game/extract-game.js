ipcRenderer.on("extracting-progress", (event, progress) => {
    const progressElement = document.getElementById("progress-bar");

    progressElement.style.width = progress.currentProgress + "%";
    progressElement.innerText = progress.currentProgress + "%";
});

ipcRenderer.on("extracting-finished", (event) => {
    const downloadButton = document.getElementById("download-button");
    const progressSection = document.getElementById("progress-section");
    const progressElement = document.getElementById("progress-bar");
    const downloadedManageButtons = document.getElementById("downloaded-manage-buttons");

    progressSection.style.visibility = "hidden";
    downloadButton.style.visibility = "hidden";
    progressElement.style.width = "0%";
    downloadedManageButtons.style.visibility = "visible";
    downloadButton.innerText = "Download";
    downloadButton.disabled = false;
});

ipcRenderer.on("extracting-error", (event) => {
    const downloadButton = document.getElementById("download-button");
    const progressSection = document.getElementById("progress-section");

    showErrorSnackbar('Error occurred while extracting game...');

    progressSection.style.visibility = "hidden";
    downloadButton.innerText = "Download";
    downloadButton.disabled = false;
});