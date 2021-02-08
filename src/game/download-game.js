function downloadGame() {
    const progressSection = document.getElementById("progress-section");
    const downloadButton = document.getElementById("download-button");

    progressSection.style.visibility = "visible";
    downloadButton.innerText = "Downloading...";
    downloadButton.disabled = true;

    ipcRenderer.send("download", {
        url: "https://www.googleapis.com/drive/v3/files/1d4JRuWS5d7R5P_RhJ5-axVDcdr_vd8fQ?alt=media&key=AIzaSyDgwFdwLoyaAWIIFCrTdLhEyi5wH3BEXc8",
        properties: {directory: `${remote.app.getPath('userData')}`}
    });
}

ipcRenderer.on("download progress", (event, progress) => {
    const progressElement = document.getElementById("progress-bar");
    const cleanProgressInPercentages = Math.floor(progress.percent * 100);

    progressElement.style.width = cleanProgressInPercentages + "%";
    progressElement.innerText = cleanProgressInPercentages + "%";
});

ipcRenderer.on("download complete", (event, file) => {
    const progressElement = document.getElementById("progress-bar");
    const downloadButton = document.getElementById("download-button");

    downloadButton.innerText = "Extracting...";
    progressElement.style.width = "0%";

    ipcRenderer.send("decompress-files");
});

ipcRenderer.on("download-error", (event) => {
    const progressSection = document.getElementById("progress-section");
    const downloadButton = document.getElementById("download-button");

    showErrorSnackbar('Error occurred while downloading game...');

    progressSection.style.visibility = "hidden";
    downloadButton.innerText = "Download";
    downloadButton.disabled = false;
});