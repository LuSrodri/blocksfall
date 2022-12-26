{
    if (document.getElementById("pressAnyButton")) {
        setInterval(() => {
            if (document.getElementById("pressAnyButton").style.opacity == 0) {
                document.getElementById("pressAnyButton").style.opacity = 1;
                return;
            }
            document.getElementById("pressAnyButton").style.opacity = 0;
        }, 500);

        document.getElementsByTagName("body")[0].addEventListener("keydown", startWebsite);
        document.getElementsByTagName("body")[0].addEventListener("mousedown", startWebsite);
        document.getElementsByTagName("body")[0].addEventListener("touchstart", startWebsite);
    }
}

function startWebsite() {
    document.getElementById("initialScreen").style.opacity = 0;
    setTimeout(() => {
        document.getElementById("initialScreen").style.display = "none";
        document.getElementById("mainScreen").style.opacity = 1;
        pageOnLoad();
    }, 500);
    document.getElementsByTagName("body")[0].removeEventListener("keydown", startWebsite);
    document.getElementsByTagName("body")[0].removeEventListener("mousedown", startWebsite);
    document.getElementsByTagName("body")[0].removeEventListener("touchstart", startWebsite);
}

function pageOnLoad() {
    setInitialMusic();
    setStats();
    window.scrollTo(0, 500);
}

function setInitialMusic() {
    if (sessionStorage.getItem('musicPreference') === null || sessionStorage.getItem('musicPreference') === 'true') {
        document.getElementById("buttonMusic").innerHTML = "<i class='fas fa-volume-up'></i> SOUND ON";
        addMusicElement();
    }
    else {
        document.getElementById("buttonMusic").innerHTML = "<i class='fas fa-volume-mute'></i> MUTE";
        removeMusicElement();
    }
}

function setMusicPreference() {
    if (sessionStorage.getItem('musicPreference') === null || sessionStorage.getItem('musicPreference') === 'true') {
        sessionStorage.setItem('musicPreference', 'false');
        document.getElementById("buttonMusic").innerHTML = "<i class='fas fa-volume-mute'></i> MUTE";
    }
    else if (sessionStorage.getItem('musicPreference') === 'false') {
        sessionStorage.setItem('musicPreference', 'true');
        document.getElementById("buttonMusic").innerHTML = "<i class='fas fa-volume-up'></i> SOUND ON";
    }

    setMusic();

    function setMusic() {
        if (sessionStorage.getItem('musicPreference') === null || sessionStorage.getItem('musicPreference') === 'true') {
            addMusicElement();
        }
        else {
            removeMusicElement();
        }
    }
}

function addMusicElement() {
    let music = document.createElement('audio');
    music.id = "music";
    music.src = "./sounds/music.mp3";
    music.setAttribute("autoplay", "");
    music.setAttribute("loop", "");
    let musicAux = document.getElementById("music");
    if (musicAux === null)
        document.getElementsByTagName("body")[0].appendChild(music);
}

function removeMusicElement() {
    let music = document.getElementById("music");
    if (music !== null)
        music.parentNode.removeChild(music);
}

function setStats() {
    if (document.getElementById("bronzeMedal") !== null &&
        localStorage.getItem('bronzeMedal') !== null) {
        let scoreAux = localStorage.getItem('bronzeMedal');
        scoreAux = parseInt(scoreAux);
        document.getElementById("bronzeMedal").innerHTML = scoreAux;
    }
    if (document.getElementById("silverMedal") !== null &&
        localStorage.getItem('silverMedal') !== null) {
        let scoreAux = localStorage.getItem('silverMedal');
        scoreAux = parseInt(scoreAux);
        document.getElementById("silverMedal").innerHTML = scoreAux;
    }
    if (document.getElementById("goldMedal") !== null &&
        localStorage.getItem('goldMedal') !== null) {
        let scoreAux = localStorage.getItem('goldMedal');
        scoreAux = parseInt(scoreAux);
        document.getElementById("goldMedal").innerHTML = scoreAux;
    }

    if (document.getElementById("highscore") !== null &&
        localStorage.getItem('stats') !== null) {
        let stats = JSON.parse(localStorage.getItem('stats'));
        document.getElementById("highscore").innerHTML = stats.highscore;
    }
}

function ifOnBlur() {
    if ((document.getElementById("game") !== null))
        pause('open');

    removeMusicElement();
}

function ifOnFocus() {
    if (sessionStorage.getItem('musicPreference') === "true" || sessionStorage.getItem('musicPreference') === null) {
        addMusicElement();
    }
}

function playGame() {
    window.location.href = '/play'
}

function scrollToPath(path) {
    document.getElementById(path).scrollIntoView({
        behavior: "smooth"
    });
}

async function shareIt() {
    const shareData = {
        title: "BLOCKS' FALL!",
        text: "LOOK THIS, IT'S THE BEST GAME YOU WILL KNOW!",
        url: 'https://blocksfall.io',
    }
    if (navigator.share) {
        await navigator.share(shareData);
        return;
    }
    navigator.clipboard.write(shareData.url);
    window.location.href = "/";
}

function restart() {
    if (localStorage.getItem("gameSave") !== null) localStorage.removeItem("gameSave");
    window.location.href = "/play";
}

function restartDialog(op) {
    let restartDialog = document.getElementById("restart");

    if (op === 'open' && restartDialog.open === false) {
        isPaused = true;
        restartDialog.showModal();
    }
    if (op === 'close' && restartDialog.open === true) {
        restartDialog.classList.add("hide");
        restartDialog.addEventListener('animationend', function () {
            restartDialog.classList.remove("hide");
            restartDialog.close();
            restartDialog.removeEventListener('animationend', arguments.callee, false);
        }, false);
    }

}