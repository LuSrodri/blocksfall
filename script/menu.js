
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
}