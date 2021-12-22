
updateScore()

function openDialog(){

    if(document.getElementById("dialogMenu").hasAttribute("open")){
        document.getElementById("dialogMenu").removeAttribute("open");
        return true;
    }
    else{
        document.getElementById("dialogMenu").setAttribute("open",null);
        return false;
    }
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

musicOnOff(true);
function musicOnOff(firstTime){
    if(localStorage.getItem('mute') === null){
        localStorage.setItem('mute',true);
    }
    if(!firstTime){
        if(localStorage.getItem('mute') === "false"){
            localStorage.setItem('mute',true);
        }
        else{
            localStorage.setItem('mute',false);
        }
    }
    if(localStorage.getItem('mute') === "true"){
        if(document.getElementById("music") !== null){
            document.getElementById("body").removeChild(document.getElementById("music"));
            document.getElementById("button-music").className = "fas fa-volume-mute";
            return true;
        }
    }
    else if(localStorage.getItem('mute') === "false"){
        if(document.getElementById("music") === null){
            let audio = document.createElement('audio');
            audio.src = "./music.mp3";
            audio.autoplay = 'true';
            audio.loop = 'true';
            audio.id = "music";
            document.getElementById("body").appendChild(audio);
            document.getElementById("button-music").className = "fas fa-volume-up";
            return false;
        }
    }
}