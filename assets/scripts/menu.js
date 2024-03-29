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
    if (document.getElementById("greetings")) {
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

function pageOnLoad() {
    setInitialMusic();
    window.scrollTo(0, 500);
}

function setInitialMusic() {
    if (sessionStorage.getItem('musicPreference') === 'true') {
        document.getElementById("buttonMusic").innerHTML = "<i class='fas fa-volume-up'></i> SOUND ON";
        addMusicElement();
    }
    else {
        document.getElementById("buttonMusic").innerHTML = "<i class='fas fa-volume-mute'></i> MUTE";
        removeMusicElement();
    }
}

function setMusicPreference() {
    if (sessionStorage.getItem('musicPreference') === 'true') {
        sessionStorage.setItem('musicPreference', 'false');
        document.getElementById("buttonMusic").innerHTML = "<i class='fas fa-volume-mute'></i> MUTE";
    }
    else if (sessionStorage.getItem('musicPreference') === 'false' || sessionStorage.getItem('musicPreference') === null) {
        sessionStorage.setItem('musicPreference', 'true');
        document.getElementById("buttonMusic").innerHTML = "<i class='fas fa-volume-up'></i> SOUND ON";
    }

    setMusic();

    function setMusic() {
        if (sessionStorage.getItem('musicPreference') === 'true') {
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
    music.volume = 0.4;
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

function ifOnBlur() {
    if ((document.getElementById("game") !== null))
        pause('open');

    removeMusicElement();
}

function ifOnFocus() {
    if (sessionStorage.getItem('musicPreference') === "true") {
        addMusicElement();
    }
}

function scrollToPath(path) {
    document.getElementById(path).scrollIntoView({
        behavior: "smooth"
    });
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