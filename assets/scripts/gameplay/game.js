
gameStart();

function gameStart() {
    printInitialGame();
    setTimeout(() => {
        defineCanvas();
        starting();
        controllerKeyboard();
        controllerTouch();
    }, 3000);
}

function starting() {
    socket.emit("start game", "");

    socket.on(socket.id + "", (gameJSONString) => {
        game = JSON.parse(gameJSONString);
        printNextPiece(game.letter[1]);
        printGame(game.letter[0], game.matrix);
    });

    socket.on(socket.id + "scored", (score) => {
        let scores = document.getElementsByClassName("score");
        let scored = score - parseInt(scores[0].innerHTML);

        printInfosByScore(scored);

        for (let i = 0; i < scores.length; i++) {
            let Score = parseInt(scores[i].innerHTML) + scored;
            scores[i].innerHTML = Score;
            scores[i].style.color = "#FF9A00"
        }

        if (localStorage.getItem("musicPreference") !== 'false')
            setScoredMusic();
    });

    socket.on(socket.id + "gameover", (finalScore) => {
        gameOver(finalScore);
    });
}

function pause(op) {
    let pauseDialog = document.getElementById("pause");

    if (op === 'open' && pauseDialog.open === false) {
        socket.emit("pause", true);
        pauseDialog.showModal();
    }
    if (op === 'close' && pauseDialog.open === true) {
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