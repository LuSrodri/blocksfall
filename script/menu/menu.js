
updateScore()

let countMenu = 0;
setInterval(() => {
    countMenu++;
}, 1000);

function playAGame() {
    window.location.href = '/play'

    // getPlayAGameHtml()
    // if (playAGameHtml !== null) {
    //     playAGameAux(playAGameHtml);
    // }
}

let playAGameHtml = null;

if (document.getElementsByClassName('main').length > 0) {
    playAGameHtml = getPlayAGameHtml();
}

function playAGameAux(body) {
    if (document.getElementById('body') !== null) {
        document.getElementById('body').parentNode.replaceChild(body, document.getElementById('body'));
        if (document.getElementById('hudMobile')) {
            let script = document.createElement('script')
            script.src = './game-mobile.js'
            script.id = 'scriptGame'
            document.getElementById('body').appendChild(script)

        }
        else {
            let script = document.createElement('script')
            script.src = './game.js'
            script.id = 'scriptGame'
            document.getElementById('body').appendChild(script)
        }
    }
    if (document.getElementById("score") !== null) {
        showScore();
        showScore();
    }
}

function getPlayAGameHtml() {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.responseType = "document";
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState !== 4 && xmlHttp.status !== 200) {
            return false
        }
        else if (xmlHttp.response) {
            playAGameHtml = xmlHttp.response.getElementById('body');
        }
    }
    xmlHttp.open("GET", './play', true); // true for asynchronous 
    xmlHttp.send(null);
}


////////////////////////////////////////////

// function homePage() {
//     gethomePageHtml()
//     if (homePageHtml !== null) {
//         homePageAux(homePageHtml);
//     }
// }

// let homePageHtml = gethomePageHtml();

// function homePageAux(body) {
//     if (document.getElementById('body paused') !== null) {
//         document.getElementById('body paused').parentNode.replaceChild(body, document.getElementById('body paused'));
//     }
//     if (document.getElementById("score") !== null) {
//         showScore();
//         showScore();
//     }
// }

// function gethomePageHtml() {
//     let xmlHttp = new XMLHttpRequest();
//     xmlHttp.responseType = "document";
//     xmlHttp.onreadystatechange = function () {
//         if (xmlHttp.readyState !== 4 && xmlHttp.status !== 200) {
//             return false
//         }
//         else if (xmlHttp.response) {
//             homePageHtml = xmlHttp.response.getElementById('body');
//         }
//     }
//     xmlHttp.open("GET", './', true); // true for asynchronous 
//     xmlHttp.send(null);
// }

// function stats(){
//     let xmlHttp = new XMLHttpRequest();
//     xmlHttp.responseType = "document";
//     xmlHttp.onreadystatechange = function() { 
//         if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
//             statsAux(xmlHttp.response);
//         }
//     }
//     xmlHttp.open("GET", './stats.html', true); // true for asynchronous 
//     xmlHttp.send(null);
// }

// function statsAux(res){
//     let body = res.getElementById('body');
//     document.getElementById('body').parentNode.replaceChild(body,document.getElementById('body'));
//     if(document.getElementById("scoreRecord") !== null){
//         updateScore()
//     }
// }

function sesssionStorageMusic() {
    if (sessionStorage.getItem('musicControl') === null) {
        sessionStorage.setItem('musicControl', 'true')
    }
    if (sessionStorage.getItem('musicControl') === 'true') {
        sessionStorage.setItem('musicControl', 'false')
    }
    else {
        sessionStorage.setItem('musicControl', 'true')
    }
    musicControl()
}

function musicControl(firstTimeMusic = false) {
    if (sessionStorage.getItem('musicControl') === null && firstTimeMusic === true) {
        if (document.getElementById('music') === null) {
            let music = document.createElement('audio')
            music.src = "./music.mpeg"
            music.id = "music"
            music.autoplay = ' '
            music.loop = ' '
            if (document.getElementById('body')) {
                document.getElementById('body').parentNode.appendChild(music)
            }
            else if (document.getElementById('body paused')) {
                document.getElementById('body paused').parentNode.appendChild(music)
            }
        }
    }

    if (sessionStorage.getItem('musicControl') === 'false') {
        if (document.getElementById('buttonMusic')) {
            document.getElementById('buttonMusic').className = 'fas fa-volume-mute'
            document.getElementById('volumeText').innerHTML = 'MUTE'
        }
        if (document.getElementById("music")) {
            document.getElementById('music').parentNode.removeChild(document.getElementById('music'))
        }
    }
    else if (sessionStorage.getItem('musicControl') === 'true') {

        if (document.getElementById('buttonMusic')) {
            document.getElementById('buttonMusic').className = 'fas fa-volume-up'
            document.getElementById('volumeText').innerHTML = 'SOUND ON'
        }

        if (document.getElementById('music') === null) {
            let music = document.createElement('audio')
            music.src = "./music.mpeg"
            music.id = "music"
            music.autoplay = ' '
            music.loop = ' '
            if (document.getElementById('body')) {
                document.getElementById('body').parentNode.appendChild(music)
            }
            else if (document.getElementById('body paused')) {
                document.getElementById('body paused').parentNode.appendChild(music)
            }
        }

    }
}

function showScore() {
    let scoreAux = localStorage.getItem('lastScore');
    scoreAux = parseInt(scoreAux);
    document.getElementById("score").innerHTML = scoreAux;
}

function updateScore() {
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

    if (document.getElementById("totalPlayed") !== null &&
        localStorage.getItem('totalPlayed') !== null) {
        let scoreAux = localStorage.getItem('totalPlayed');
        scoreAux = parseInt(scoreAux);
        document.getElementById("totalPlayed").innerHTML = scoreAux;
    }
    if (document.getElementsByClassName("scoreRecord").length > 0 &&
        localStorage.getItem('scoreRecord') !== null) {
        let scoreAux = localStorage.getItem('scoreRecord');
        scoreAux = parseInt(scoreAux);
        for (let x = 0; x < document.getElementsByClassName("scoreRecord").length; x++) {
            document.getElementsByClassName("scoreRecord")[x].innerHTML = scoreAux;
        }

    }
    if (document.getElementById("lastScore") !== null &&
        localStorage.getItem('lastScore') !== null) {
        let scoreAux = localStorage.getItem('lastScore');
        scoreAux = parseInt(scoreAux);
        document.getElementById("lastScore").innerHTML = scoreAux;
    }
    if (document.getElementById("totalScored") !== null &&
        localStorage.getItem('totalScored') !== null) {
        let scoreAux = localStorage.getItem('totalScored');
        scoreAux = parseInt(scoreAux);
        document.getElementById("totalScored").innerHTML = scoreAux;
    }
    if (document.getElementById("pieceGenerated") !== null &&
        localStorage.getItem('pieceGenerated') !== null) {
        let scoreAux = localStorage.getItem('pieceGenerated');
        scoreAux = parseInt(scoreAux);
        document.getElementById("pieceGenerated").innerHTML = scoreAux;
    }
    if (document.getElementById("linesCompleted") !== null &&
        localStorage.getItem('linesCompleted') !== null) {
        let scoreAux = localStorage.getItem('linesCompleted');
        scoreAux = parseInt(scoreAux);
        document.getElementById("linesCompleted").innerHTML = scoreAux;
    }
}

function ifOnBlur() {
    if ((document.getElementsByClassName("hud").length > 0)) {
        pause()
    }
    if (sessionStorage.getItem('musicControl') === "true" || sessionStorage.getItem('musicControl') === null) {
        if (document.getElementById("music")) {
            document.getElementById('music').parentNode.removeChild(document.getElementById('music'))
        }
    }
}

function ifOnClicked() {
    if (sessionStorage.getItem('musicControl') === "true" || sessionStorage.getItem('musicControl') === null) {
        if (document.getElementById("music") === null) {
            let music = document.createElement('audio')
            music.src = "./music.mpeg"
            music.id = "music"
            music.autoplay = ' '
            music.loop = ' '
            if (document.getElementById('body')) {
                document.getElementById('body').parentNode.appendChild(music)
            }
            else if (document.getElementById('body paused')) {
                document.getElementById('body paused').parentNode.appendChild(music)
            }
        }

    }
}

function playNewGame() {
    if (localStorage.getItem("canvasGame") !== null) {
        localStorage.removeItem("canvasGame")
    }
    if (localStorage.getItem("canvasGameMobile") !== null) {
        localStorage.removeItem("canvasGameMobile")
    }
    window.location.href = '/play'
}

if (localStorage.getItem("canvasGame") === null && localStorage.getItem("canvasGameMobile") === null) {
    document.getElementById("playGame").parentNode.removeChild(document.getElementById("playGame"))
}

function newTabNft() {
    if(window.open){
        let win = window.open("https://opensea.io/collection/blocksfall", '_blank');
        win.focus();
    }
    else {
        window.location.href = 'https://opensea.io/collection/blocksfall'
    }
}