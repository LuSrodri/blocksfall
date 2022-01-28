
updateScore()

let countMenu = 0;
setInterval(() => {
    countMenu++;
}, 1000);


function playAGame() {
    getPlayAGameHtml()
    if (playAGameHtml !== null) {
        playAGameAux(playAGameHtml);
    }
}

let playAGameHtml = null;

if (document.getElementsByClassName('main').length > 0) {
    playAGameHtml = getPlayAGameHtml();
}

function playAGameAux(body) {

    if (document.getElementById('body') !== null) {
        document.getElementById('body').parentNode.replaceChild(body, document.getElementById('body'));
        if (document.getElementById('hudMobile') === null) {
            let scriptGame = document.createElement('script');
            scriptGame.src = "./game.js"
            scriptGame.className = "scriptGame"
            document.getElementById('body').parentNode.appendChild(scriptGame)
        }
        else {
            let scriptGameMobile = document.createElement('script');
            scriptGameMobile.src = "./game-mobile.js"
            scriptGameMobile.className = "scriptGame"
            document.getElementById('body').parentNode.appendChild(scriptGameMobile)
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

function homePage() {
    gethomePageHtml()
    if (homePageHtml !== null) {
        homePageAux(homePageHtml);
    }
}

let homePageHtml = null;

if (document.getElementsByClassName('hud').length > 0) {
    homePageHtml = gethomePageHtml();
}

function homePageAux(body) {

    if (document.getElementById('body') !== null) {
        document.getElementById('body').parentNode.replaceChild(body, document.getElementById('body'));
        document.removeChild(document.getElementsByClassName('scriptGame'))
    }
    if (document.getElementById("score") !== null) {
        showScore();
        showScore();
    }
}

function gethomePageHtml() {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.responseType = "document";
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState !== 4 && xmlHttp.status !== 200) {
            return false
        }
        else if (xmlHttp.response) {
            homePageHtml = xmlHttp.response.getElementById('body');
        }
    }
    xmlHttp.open("GET", './', true); // true for asynchronous 
    xmlHttp.send(null);
}

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
    if (document.getElementById("scoreRecord") !== null &&
        localStorage.getItem('scoreRecord') !== null) {
        let scoreAux = localStorage.getItem('scoreRecord');
        scoreAux = parseInt(scoreAux);
        document.getElementById("scoreRecord").innerHTML = scoreAux;
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
