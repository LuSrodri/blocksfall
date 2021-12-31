
let gaming = document.getElementById('body');

updateScore()

function pause(){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.responseType = "document";
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            pauseAux(xmlHttp.response);
        }
    }
    xmlHttp.open("GET", './pause.html', true); // true for asynchronous 
    xmlHttp.send(null);
}

function pauseAux(res){
    let body = res.getElementById('body paused');
    document.getElementById('body').parentNode.replaceChild(body,document.getElementById('body'));
    if(document.getElementById("score") !== null){
        showScore();
        showScore();
    }
}

function resume(){
    document.getElementById('body paused').parentNode.replaceChild(gaming,document.getElementById('body paused'));
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
}

// musicOnOff(true);
// function musicOnOff(firstTime){
//     if(localStorage.getItem('mute') === null){
//         localStorage.setItem('mute',true);
//     }
//     if(!firstTime){
//         if(localStorage.getItem('mute') === "false"){
//             localStorage.setItem('mute',true);
//         }
//         else{
//             localStorage.setItem('mute',false);
//         }
//     }
//     if(localStorage.getItem('mute') === "true"){
//         if(document.getElementById("music") !== null){
//             if(document.getElementById("body") !== null){
//                 document.getElementById("body").parentNode.removeChild(document.getElementById("music"));
//             }
//             else{
//                 document.getElementById("body paused").parentNode.removeChild(document.getElementById("music"));
//             }
//             document.getElementById("button-music").className = "fas fa-volume-mute";
//             return true;
//         }
//     }
//     else if(localStorage.getItem('mute') === "false"){
//         if(document.getElementById("music") === null){
//             let audio = document.createElement('audio');
//             audio.src = "./music.mp3";
//             audio.autoplay = 'true';
//             audio.loop = 'true';
//             audio.id = "music";
//             if(document.getElementById("body") !== null){
//                 document.getElementById("body").parentNode.appendChild(audio);
//             }
//             else{
//                 document.getElementById("body paused").parentNode.appendChild(audio);
//             }
//             document.getElementById("button-music").className = "fas fa-volume-up";
//             return false;
//         }
//     }
// }