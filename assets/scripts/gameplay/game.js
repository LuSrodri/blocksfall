
gameStart();

function gameStart() {
    defineCanvas();
    startGameLoop();
    printNextPiece();
    controllerKeyboard();
    controllerTouch();
}

function pause(op) {
    let pauseDialog = document.getElementById("pause");

    if (!isGameOver) {
        if (op === 'open' && pauseDialog.open === false) {
            isPaused = true;
            pauseDialog.showModal();
        }
        if (op === 'close' && pauseDialog.open === true) {
            pauseDialog.classList.add("hide");
            pauseDialog.addEventListener('animationend', function () {
                pauseDialog.classList.remove("hide");
                pauseDialog.close();
                pauseDialog.removeEventListener('animationend', arguments.callee, false);
            }, false);
            isPaused = false;
            document.getElementById("game").focus();
        }
    }
}

function gameOver() { 
    let gameOverDialog = document.getElementById("gameOver");

    let stats = { highscore: gameScore };
    if (localStorage.getItem("stats")) {
        if (JSON.parse(localStorage.getItem("stats")).highscore < gameScore) {
            localStorage.setItem("stats", JSON.stringify(stats));
        }
    }
    else {
        localStorage.setItem("stats", JSON.stringify(stats));
    }

    isGameOver = true;
    clearInterval(game);

    let score = parseInt(document.getElementsByClassName("score")[0].innerHTML);
    if (score >= 200 && score < 500) {
        document.getElementById("medalOne").src = "./images/medals/bronze_medal.webp";
        let aux = localStorage.getItem("bronzeMedal");
        if (aux) {
            aux = parseInt(aux) + 1;
            localStorage.setItem("bronzeMedal", aux);
        }
        else
            localStorage.setItem("bronzeMedal", 1);
    }
    if (score >= 500 && score < 1000) {
        document.getElementById("medalOne").src = "./images/medals/silver_medal.webp";
        let aux = localStorage.getItem("silverMedal");
        if (aux) {
            aux = parseInt(aux) + 1;
            localStorage.setItem("silverMedal", aux);
        }
        else
            localStorage.setItem("silverMedal", 1);
    }
    if (score >= 1000) {
        document.getElementById("medalOne").src = "./images/medals/gold_medal.webp";
        let aux = localStorage.getItem("goldMedal");
        if (aux) {
            aux = parseInt(aux) + 1;
            localStorage.setItem("goldMedal", aux);
        }
        else
            localStorage.setItem("goldMedal", 1);
    }
    if (score >= 200) {
        document.getElementById("medalOne").style.display = "unset";
    }

    if (localStorage.getItem("musicPreference") !== 'false')
        setGameOverMusic();

    gameOverDialog.showModal();
    localStorage.removeItem("gameSave");

    function setGameOverMusic() {
        let gameOverMusic = document.createElement("audio");
        gameOverMusic.src = "./sounds/success.mp3";
        gameOverMusic.setAttribute("autoplay", "");
        document.getElementsByTagName("body")[0].appendChild(gameOverMusic);
    }
}