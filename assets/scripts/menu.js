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

{
    if (document.getElementById("howtoplay")) {
        document.getElementById("howtoplay").addEventListener("click", () => howToPlayDialog("open", "howtoplayDialogPC"));
        document.getElementById("howtoplay").addEventListener("touchend", () => howToPlayDialog("open", "howtoplayDialogMobile"));
    }
}

{
    if (document.getElementById("greetings")){
        let now = new Date();
        if (now.getHours() >= 5 && now.getHours() < 12) {
            document.getElementById("greetings").innerHTML = "GOOD MORNING!";
        }
        else if (now.getHours() >= 12 && now.getHours() < 18) {
            document.getElementById("greetings").innerHTML = "GOOD AFTERNOON!";
        }
        else if (now.getHours() >= 18 || now.getHours() < 5) {
            document.getElementById("greetings").innerHTML = "GOOD EVENING!";
        }
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

    document.getElementsByTagName("body")[0].setAttribute("onblur", "ifOnBlur()");
    document.getElementsByTagName("body")[0].setAttribute("onfocus", "ifOnFocus()");
}

function pageOnLoad() {
    setInitialMusic();
    setStats();
    window.scrollTo(0, 500);
}

function setInitialMusic() {
    if (localStorage.getItem('musicPreference') === null || localStorage.getItem('musicPreference') === 'true') {
        document.getElementById("buttonMusic").innerHTML = "<i class='fas fa-volume-up'></i> SOUND ON";
        addMusicElement();
    }
    else {
        document.getElementById("buttonMusic").innerHTML = "<i class='fas fa-volume-mute'></i> MUTE";
        removeMusicElement();
    }
}

function setMusicPreference() {
    if (localStorage.getItem('musicPreference') === null || localStorage.getItem('musicPreference') === 'true') {
        localStorage.setItem('musicPreference', 'false');
        document.getElementById("buttonMusic").innerHTML = "<i class='fas fa-volume-mute'></i> MUTE";
    }
    else if (localStorage.getItem('musicPreference') === 'false') {
        localStorage.setItem('musicPreference', 'true');
        document.getElementById("buttonMusic").innerHTML = "<i class='fas fa-volume-up'></i> SOUND ON";
    }

    setMusic();

    function setMusic() {
        if (localStorage.getItem('musicPreference') === null || localStorage.getItem('musicPreference') === 'true') {
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
    if (localStorage.getItem('musicPreference') === "true" || localStorage.getItem('musicPreference') === null) {
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

function howToPlayDialog(op1, op2) {
    let howToPlay = document.getElementById(op2);
    if (op1 === "open") {
        howToPlay.showModal();
        return;
    }
    howToPlay.classList.add("hide");
    howToPlay.addEventListener('animationend', function () {
        howToPlay.classList.remove("hide");
        howToPlay.close();
        howToPlay.removeEventListener('animationend', arguments.callee, false);
    }, false);
}