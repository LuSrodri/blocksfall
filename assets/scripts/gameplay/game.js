
let isGameOver = false;
let isPaused = false;
let scores = document.getElementsByClassName("score");

gameStart();

function gameStart() {
    printInitialGame();
    setTimeout(() => {
        defineCanvas();
        starting();
        controllerKeyboard();
        controllerTouch();
    }, 2000);
}

function starting() {
    if (localStorage.getItem("gameSave")) {
        socket.emit("start game", localStorage.getItem("gameSave"));
    }
    else {
        socket.emit("start game", "");
    }

    socket.io.on("reconnect", (attempt) => {
        clearTimeout(timeToReconnect);
        socket.emit("start game", localStorage.getItem("gameSave"));
        reconnection("close");
    });

    socket.on(socket.id + "created game", (gameId) => {
        localStorage.setItem("gameSave", gameId);
        initializeSocketListeners(gameId);
    });
}

function initializeSocketListeners(gameId) {

    socket.on(gameId + "", (gameJSONString) => {
        if (isPaused && !isGameOver) {
            socket.emit("pause", true);
        }

        game = JSON.parse(gameJSONString);

        for (let i = 0; i < scores.length; i++) {
            scores[i].innerHTML = game.gameScore;
        }

        printNextPiece(game.letter[1]);
        printGame(game.letter[0], game.matrix);
    });

    socket.on(gameId + "scored", (data) => {
        scored(data.score);
        printInfosByScore(data.scored);

        if (localStorage.getItem("musicPreference") !== 'false')
            setScoredMusic();
    });

    socket.on(gameId + "gameover", (finalScore) => {
        gameOver(finalScore);
        localStorage.removeItem("gameSave");
    });
}

function scored(score) {
    for (let i = 0; i < scores.length; i++) {
        scores[i].innerHTML = score;
        scores[i].style.color = "#FF9A00";
    }

    setTimeout(() => {
        for (let i = 0; i < scores.length; i++) {
            scores[i].style.color = "#FFFFFF";
        }
    }, 500);
}

function pause(op) {
    if (isGameOver)
        return;

    let pauseDialog = document.getElementById("pause");

    if (op === 'open' && pauseDialog.open === false) {
        isPaused = true;
        socket.emit("pause", true);
        pauseDialog.showModal();
    }
    if (op === 'close' && pauseDialog.open === true) {
        isPaused = false;
        pauseDialog.classList.add("hide");
        pauseDialog.addEventListener('animationend', function () {
            pauseDialog.classList.remove("hide");
            pauseDialog.close();
            pauseDialog.removeEventListener('animationend', arguments.callee, false);
        }, false);
        socket.emit("pause", false);
        document.getElementById("game").focus();
    }
}

function gameOver(finalScore) {
    isGameOver = true;

    let gameOverDialog = document.getElementById("gameOver");

    let stats = { highscore: finalScore };
    if (localStorage.getItem("stats")) {
        if (JSON.parse(localStorage.getItem("stats")).highscore < finalScore) {
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
        document.getElementById("medalOne").src = "./images/medals/bronze_medal.png";
        let aux = localStorage.getItem("bronzeMedal");
        if (aux) {
            aux = parseInt(aux) + 1;
            localStorage.setItem("bronzeMedal", aux);
        }
        else
            localStorage.setItem("bronzeMedal", 1);
    }
    if (score >= 500 && score < 1000) {
        document.getElementById("medalOne").src = "./images/medals/silver_medal.png";
        let aux = localStorage.getItem("silverMedal");
        if (aux) {
            aux = parseInt(aux) + 1;
            localStorage.setItem("silverMedal", aux);
        }
        else
            localStorage.setItem("silverMedal", 1);
    }
    if (score >= 1000) {
        document.getElementById("medalOne").src = "./images/medals/gold_medal.png";
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

function reconnection(op) {
    let disconnectionDialog = document.getElementById("lostconnection");

    if (op === 'open' && !disconnectionDialog.open) {
        disconnectionDialog.showModal();
    }
    else if (op === 'close' && disconnectionDialog.open) {
        disconnectionDialog.classList.add("hide");
        disconnectionDialog.addEventListener('animationend', function () {
            disconnectionDialog.classList.remove("hide");
            disconnectionDialog.close();
            disconnectionDialog.removeEventListener('animationend', arguments.callee, false);
        }, false);
    }
}

function disconnection() {
    document.getElementById("tryingText").innerHTML = "COULDN'T TO RECONNECT";
    document.getElementById("buttonToReloading").style.display = "unset";
}