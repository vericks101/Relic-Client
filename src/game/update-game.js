function checkForGameUpdates() {
    const progressSection = document.getElementById(`${currentTab}-progress-section`);
    const progressElement = document.getElementById(`${currentTab}-progress-bar`);
    const downloadButton = document.getElementById(`${currentTab}-download-button`);

    progressElement.style.width = "0%";
    progressSection.style.visibility = "visible";
    downloadButton.style.visibility = "visible";
    downloadButton.disabled = true;
    downloadButton.innerText = "Checking for Updates...";

    var downloadVersionUrl;
    switch(currentTab) {
        case 'Unbound':
            downloadVersionUrl = UNBOUND_VERSION_URL;
            break;
    }

    ipcRenderer.send("check-for-game-updates", {
        url: downloadVersionUrl,
        properties: {directory: `${remote.app.getPath('userData')}`}
    });
}

ipcRenderer.on("check-for-game-updates-progress", (event, progress) => {
    const progressElement = document.getElementById(`${currentTab}-progress-bar`);
    const cleanProgressInPercentages = Math.floor(progress.percent * 100);

    progressElement.style.width = cleanProgressInPercentages + "%";
    progressElement.innerText = cleanProgressInPercentages + "%";
});

ipcRenderer.on("check-for-game-updates-complete", (event) => {
    var versionFileName;
    switch(currentTab) {
        case 'Unbound':
            versionFileName = UNBOUND_VERSION_FILE_NAME;
            break;
    }

    ipcRenderer.send("compare-game-versions", {
        currentTab: currentTab,
        versionFileName: versionFileName
    });
});

ipcRenderer.on("compare-game-versions-complete", (event, args) => {
    if (args.updateNeeded) {
        downloadGame(UNBOUND_DOWNLOAD_URL, UNBOUND_EXTRACT_FILE_NAME);
    } else {
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
    }
});

ipcRenderer.on("check-for-game-updates-error", (event) => {
    const progressSection = document.getElementById(`${currentTab}-progress-section`);
    const downloadButton = document.getElementById(`${currentTab}-download-button`);

    showErrorSnackbar('Error occurred while checking game version...');

    progressSection.style.visibility = "hidden";
    downloadButton.innerText = "Download";
    downloadButton.disabled = false;
});

ipcRenderer.on("compare-game-versions-error", (event) => {
    const progressSection = document.getElementById(`${currentTab}-progress-section`);
    const downloadButton = document.getElementById(`${currentTab}-download-button`);

    showErrorSnackbar('Error occurred while comparing game versions...');

    progressSection.style.visibility = "hidden";
    downloadButton.innerText = "Download";
    downloadButton.disabled = false;
});