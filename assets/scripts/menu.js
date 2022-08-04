
function pageOnLoad() {
    setInitialMusic();
    setStats();
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
    music.src = "./sounds/music2.mp3";
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

function playGame(newGame = true) {
    if (localStorage.getItem("gameSave") !== null && newGame) localStorage.removeItem("gameSave");
    window.location.href = '/play'
}

if (localStorage.getItem("gameSave") === null && document.getElementById("playGame") !== null) {
    document.getElementById("playGame").setAttribute("disabled", true);
}

function scrollToPath(path) {
    document.getElementById(path).scrollIntoView({
        behavior: "smooth"
    });
}