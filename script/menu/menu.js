
let gaming = document.getElementById('body');

updateScore()

let pauseHtml = getPauseHtml();

let countMenu = 0;
setInterval(() => {
    countMenu++;
}, 1000);

function getPauseHtml(){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.responseType = "document";
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            pauseHtml = xmlHttp.response.getElementById('body paused');;
        }
    }
    xmlHttp.open("GET", './pause.html', true); // true for asynchronous 
    xmlHttp.send(null);
}

function setPauseHtml(){
    if(pauseHtml === null){
        getPauseHtml();
    }
}

function pause(){
    setPauseHtml();
    if(pauseHtml !== null){
        pauseAux(pauseHtml);
    }
}

function pauseAux(body){
    
    if(document.getElementById('body') !== null)
        document.getElementById('body').parentNode.replaceChild(body,document.getElementById('body'));
    if(document.getElementById("score") !== null){
        showScore();
        showScore();
    }
}

function stats(){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.responseType = "document";
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            statsAux(xmlHttp.response);
        }
    }
    xmlHttp.open("GET", './stats.html', true); // true for asynchronous 
    xmlHttp.send(null);
}

function statsAux(res){
    let body = res.getElementById('body');
    document.getElementById('body').parentNode.replaceChild(body,document.getElementById('body'));
    if(document.getElementById("scoreRecord") !== null){
        updateScore()
    }
}

function resume(){
    document.getElementById('body paused').parentNode.replaceChild(gaming,document.getElementById('body paused'));
}

function resumeMain(){
    document.getElementById('body').parentNode.replaceChild(gaming,document.getElementById('body'));
}

function showScore(){
    let scoreAux = localStorage.getItem('lastScore');
    scoreAux = parseInt(scoreAux);
    document.getElementById("score").innerHTML = scoreAux;
}

function updateScore(){
    if(document.getElementById("scoreRecord") !== null){
        let scoreAux = localStorage.getItem('scoreRecord');
        scoreAux = parseInt(scoreAux);
        document.getElementById("scoreRecord").innerHTML = scoreAux;
    }
    if(document.getElementById("lastScore") !== null){
        let scoreAux = localStorage.getItem('lastScore');
        scoreAux = parseInt(scoreAux);
        document.getElementById("lastScore").innerHTML = scoreAux;
    }
    if(document.getElementById("totalScored") !== null){
        let scoreAux = localStorage.getItem('totalScored');
        scoreAux = parseInt(scoreAux);
        document.getElementById("totalScored").innerHTML = scoreAux;
    }
    if(document.getElementById("pieceGenerated") !== null){
        let scoreAux = localStorage.getItem('pieceGenerated');
        scoreAux = parseInt(scoreAux);
        document.getElementById("pieceGenerated").innerHTML = scoreAux;
    }
    if(document.getElementById("linesCompleted") !== null){
        let scoreAux = localStorage.getItem('linesCompleted');
        scoreAux = parseInt(scoreAux);
        document.getElementById("linesCompleted").innerHTML = scoreAux;
    }
}
