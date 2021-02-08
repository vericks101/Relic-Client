let unbound = `
<style>
    body {
        background-image: url("./assets/UnboundBackground.PNG");
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        position: relative;
        height: 720px;
        text-align: center;
        box-shadow: inset 0 0 0 1000px rgba(0,0,0,.3);
    }

    .header {
        text-align: center;
        margin-top: 20px;
        background: #0000004a;
        color: white;
    }

    .image-section {
        display: flex;
        padding-left: 25px;
    }

    .image-section img {
        margin-top: 23px;
    }

    .header-section {
        text-align: left;
        padding: 10px 0px 10px 10px;
    }

    .header-section p {
        margin: 0px;
        font-size: 25px;
    }

    .about-section {
        text-align: left;
        width: 550px;
        float: right;
        padding: 15px 15px 0px 0px;
        color: white;
    }

    .about-content-section {
        background-color: #0000008c;
    }

    .period-separator {
        color: white;
    }

    .about-content-section p {
        padding: 5px 5px 5px 5px;
        color: white;
    }

    .game-manage-buttons {
        right: 15px;
        bottom: 40px;
        position: absolute;
    }
</style>
<div class="header">
    <div class="image-section">
        <img alt="" src="./assets/UnboundIcon.png" width="40" height="40">
        
        <div class="header-section">
            <p>Unbound</p>
            <span class="badge bg-dark">2D</span>
            <span class="badge bg-dark">RPG</span>
            <span class="badge bg-dark">Sandbox</span>
            <span class="badge bg-dark">Single Player</span>
        </div>
    </div>
</div>
<div class="about-section">
    <h3>About Unbound</h3>
    <img style="padding-bottom: 4px;" data-bs-toggle="tooltip" data-bs-placement="right" title="Windows" alt="" src="./assets/windowslogo.png" width="21" height="21">
    <span class="period-separator">.</span>
    <span>Version 1.0.0</span>
    <span class="period-separator">.</span>
    <span>Released Dec. 26th 2017</span>
    <div class="about-content-section">
        <p>
            The very solar system is at your fingertips as you fight for the survival of the human race, for fortune, and for glory. 
            Delve deep into the unique planets throughout the solar system and fight various races of aliens and other menacing foes. 
            Blending the elements of classic action RPG games with the freedom of randomly generated sandbox-style creativity, 
            Unbound is a unique gaming experience where both the journey and the destination are as unique as the player experience.
        </p>
    </div>
</div>
<div class="game-manage-buttons">
    <button type="button" class="btn btn-outline-light">Download</button>
</div>
`