function downloadGame(downloadUrl, extractingFileName) {
    const progressSection = document.getElementById(`${currentTab}-progress-section`);
    const downloadButton = document.getElementById(`${currentTab}-download-button`);

    progressSection.style.visibility = "visible";
    downloadButton.innerText = "Downloading...";
    downloadButton.disabled = true;

    ipcRenderer.send("download", {
        url: downloadUrl,
        extractingFileName: extractingFileName,
        properties: {directory: `${remote.app.getPath('userData')}`}
    });
}

ipcRenderer.on("download progress", (event, progress) => {
    const progressElement = document.getElementById(`${currentTab}-progress-bar`);
    const cleanProgressInPercentages = Math.floor(progress.percent * 100);

    progressElement.style.width = cleanProgressInPercentages + "%";
    progressElement.innerText = cleanProgressInPercentages + "%";
});

ipcRenderer.on("download complete", (event, file, extractingFileName) => {
    const progressElement = document.getElementById(`${currentTab}-progress-bar`);
    const downloadButton = document.getElementById(`${currentTab}-download-button`);

    downloadButton.innerText = "Extracting...";
    progressElement.style.width = "0%";

    ipcRenderer.send("decompress-files", {
        extractingFileName: extractingFileName
    });
});

ipcRenderer.on("download-error", (event) => {
    const progressSection = document.getElementById(`${currentTab}-progress-section`);
    const downloadButton = document.getElementById(`${currentTab}-download-button`);

    showErrorSnackbar('Error occurred while downloading game...');

    progressSection.style.visibility = "hidden";
    downloadButton.innerText = "Download";
    downloadButton.disabled = false;
});