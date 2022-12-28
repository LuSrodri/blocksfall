
// props
let matrix = null;
let isPaused = false;
let letter = new Array();
let letters = ['T', 'Z', 'I', 'L', 'J', 'S', 'O'];
let piece = null;
let game = null;
let timeLoop = 750;
let gameScore = 0;
let isGameOver = false;

// canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
defineCanvas();

//start game
if (localStorage.getItem("gameSave")) {
    let gameSave = JSON.parse(localStorage.getItem("gameSave"));
    gameStart(gameSave.m, gameSave.timeLoop, gameSave.letter, gameSave.score, gameSave.piece);
}
else {
    gameStart();
}

function gameStart(m = null, time = 750, letterAux = null, initialScore = 0, pieceAux = null) {
    timeLoop = time;
    gameScore = initialScore;
    matrix = m;
    letter = letterAux;
    piece = pieceAux;
    if (!validateMatrix(matrix))
        defineNewGame();
    if (letter === null)
        defineNewGame();
    if (letter.length === 2) {
        if (letters.find(e => e === letter[0]) === undefined || letters.find(e => e === letter[1]) === undefined) {
            defineNewGame();
        }
    }
    else {
        defineNewGame();
    }
    if (timeLoop > 750)
        defineNewGame();
    if (piece) {
        for (let i = 0; i < piece.length; i++)
            for (let j = 0; j < piece[i].length; j++)
                if (piece[i][j] !== 0 && piece[i][j] !== 1)
                    defineNewGame();
    }
    else {
        defineNewGame();
    }

    function defineNewGame() {
        matrix = makeMatrix(12, 16);
        letter = new Array();
        setLetter();
        timeLoop = 750;
        gameScore = 0;
    }

    let scores = document.getElementsByClassName("score");
    for (let i = 0; i < scores.length; i++) {
        scores[i].innerHTML = gameScore;
    }

    printNextPiece();
    game = setInterval(gameLoop, timeLoop);
    controller();
    controllerTouch();
}

function gameLoop() {
    let scores = document.getElementsByClassName("score");
    for (let i = 0; i < scores.length; i++) {
        scores[i].style.color = ""
    }

    if (!isPaused && !isGameOver) {
        let gameSave = { m: matrix, timeLoop, letter, score: gameScore, piece };
        gameSave = JSON.stringify(gameSave);
        localStorage.setItem("gameSave", gameSave);

        if (testIfHavePiece(matrix)) {
            downPiece(letter[0]);
        }
        else if (ifScored()) { }
        else {
            setLetter();
            printNextPiece();
            piece = createPiece(letter[0]);
            if (ifCatchedTop() || !putPieceV2(piece, 0, 5)) {
                isGameOver = true;
                gameOver();
            }
        }
        shadowPiece();
        printGame(letter[0]);
    }
}

function setLetter() {
    let lettersIndex = Math.floor(Math.random() * letters.length);;
    if (letter.length === 0) {
        letter.push(letters[lettersIndex]);
        lettersIndex = Math.floor(Math.random() * letters.length);
        letter.push(letters[lettersIndex]);
        return;
    }
    letter.shift();
    letter.push(letters[lettersIndex]);
}

function validateMatrix(m) { //validate if the matrix follow the pattern
    if (m === null)
        return false;
    if (m.length !== 16)
        return false;
    if (m[0].length !== 12)
        return false;
    m.forEach(row => {
        row.forEach(el => {
            if (el !== 0 && el !== 1 && el !== 'T' && el !== 'Z' && el !== 'I' && el !== 'L' && el !== 'J' && el !== 'S' && el !== 'O')
                return false;
        });
    });

    return true;
}

function makeMatrix(width, height) { //make the matrix with the width and height for the game
    let matrix = new Array();
    for (let y = 0; y < height; y++) {
        matrix[y] = new Array();
        for (let x = 0; x < width; x++) {
            matrix[y][x] = 0;
        }
    }
    return matrix;
}

function testIfHavePiece(mAux) { //check if exist a free piece in the matrix
    let count = 0;
    let length = (mAux.length - 1);
    for (let x = length; x >= 0; x--) {
        if (mAux[x].indexOf(1) !== -1) {
            count++;
        }
    }
    if (count > 0) {
        return true; //return true if there is a free piece in the matrix
    }
    return false;  //return false if there is not a free piece in the matrix
}

function downPiece(letterAux) { //move the piece down
    let length = (matrix.length - 1);
    let count = 0;

    for (let x = 0; x <= length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            if (x !== (length)) {
                if (matrix[x][y] === 1) {
                    if (matrix[x + 1][y] !== 1 && matrix[x + 1][y] !== 0 && matrix[x + 1][y] !== 2) {
                        count++;
                    }
                }
            }
        }
    }
    if (matrix[length].indexOf(1) !== -1) {
        count++;
    }

    if (count > 0) {
        for (let x = (length); x >= 0; x--) {
            for (let y = 0; y < matrix[x].length; y++) {
                if (matrix[x][y] === 1) {
                    matrix[x][y] = letterAux;
                }
            }
        }
    }
    else {
        for (let x = (length); x >= 0; x--) {
            for (let y = 0; y < matrix[x].length; y++) {
                if (matrix[x][y] === 1) {
                    matrix[x + 1][y] = 1;
                    matrix[x][y] = 0;
                }
            }
        }
    }

}

function shadowPiece() { //project the shadow under the piece
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            if (matrix[x][y] === 1) {
                for (let z = (x + 1); z < matrix.length; z++) {
                    if (matrix[z][y] === 0) {
                        matrix[z][y] = 2;
                    }
                }
            }
            else if (matrix[x][y] !== 1 && matrix[x][y] !== 2) {
                for (let z = (x + 1); z < matrix.length; z++) {
                    if (matrix[z][y] === 2) {
                        matrix[z][y] = 0;
                    }
                }
            }
        }
    }
}

function printGame(letterAux) { //print the game with the colors of the pieces
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            if (matrix[x][y] === 1) {
                ctx.fillStyle = colors(letterAux);
                ctx.fillRect(y * 100, x * 100, (y + 100), (x + 100));
                ctx.strokeStyle = '#2a2a30';
                ctx.strokeRect(y * 100, x * 100, (y + 100), (x + 100));
            }
            else if (matrix[x][y] === 0) {
                ctx.fillStyle = '#2a2a30';
                ctx.fillRect(y * 100, x * 100, (y + 100), (x + 100));
            }

            else if (matrix[x][y] === 2) {
                ctx.fillStyle = '#1E212D';
                ctx.fillRect(y * 100, x * 100, (y + 100), (x + 100));
            }

            else if (matrix[x][y] !== 1 && matrix[x][y] !== 0 && matrix[x][y] !== 2) {
                ctx.fillStyle = colors(matrix[x][y]);
                ctx.fillRect(y * 100, x * 100, (y + 100), (x + 100));
            }
            ctx.strokeStyle = '#1E212D';
            ctx.strokeRect(y * 100, x * 100, (y + 100), (x + 100));
        }
    }
}

let isPrintText = false;
let alpha = 0.0;
let text = '';
function printText(scored, printListener = false) { //print text when the player scored
    if (printListener === true) {
        ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
        ctx.font = "bolder 120px 'Oswald'"
        ctx.textAlign = "center";
        ctx.shadowBlur = 8;
        ctx.fillText(text, 600, 800);
        return;
    }
    isPrintText = true;
    text = "GOOD!😁";
    if (scored === 20)
        text = "AWESOME!😙";
    if (scored === 30)
        text = "FANTASTIC!😎";
    if (scored === 40)
        text = "WOW!😯";
    let timing = 0;
    alpha = 0.0;
    let loopText = setInterval(() => {
        printGame(letter[0]);
        ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
        ctx.font = "bolder 120px 'Oswald'"
        ctx.textAlign = "center";
        ctx.shadowBlur = 8;
        ctx.fillText(text, 600, 800);
        if (alpha <= 1.0 && timing < 80)
            alpha += 0.05;
        if (alpha >= 0.0 && timing > 120)
            alpha -= 0.05;
        timing++;
    }, 10);
    setTimeout(() => {
        clearInterval(loopText);
        printGame(letter[0]);
        isPrintText = false;
    }, 1500);
}

function printNextPiece() {
    let canvasNextPiece = document.getElementById("nextPiece");
    let nextPiece = createPiece(letter[1]);

    if (nextPiece.length === 2 && nextPiece[0].length === 3) {
        canvasNextPiece.width = "300";
        canvasNextPiece.height = "200";
        canvasNextPiece.style.width = "9vmin";
        canvasNextPiece.style.height = "6vmin";
    }
    if (nextPiece.length === 1 && nextPiece[0].length === 4) {
        canvasNextPiece.width = "400";
        canvasNextPiece.height = "100";
        canvasNextPiece.style.width = "12vmin";
        canvasNextPiece.style.height = "3vmin";
    }
    if (nextPiece.length === 3 && nextPiece[0].length === 2) {
        canvasNextPiece.width = "200";
        canvasNextPiece.height = "300";
        canvasNextPiece.style.width = "6vmin";
        canvasNextPiece.style.height = "9vmin";
    }
    if (nextPiece.length === 2 && nextPiece[0].length === 2) {
        canvasNextPiece.width = "200";
        canvasNextPiece.height = "200";
        canvasNextPiece.style.width = "6vmin";
        canvasNextPiece.style.height = "6vmin";
    }
    let ctxNextPiece = canvasNextPiece.getContext("2d");

    for (let x = 0; x < nextPiece.length; x++) {
        for (let y = 0; y < nextPiece[x].length; y++) {
            if (nextPiece[x][y] === 1) {
                ctxNextPiece.fillStyle = colors(letter[1]);
                ctxNextPiece.fillRect(y * 100, x * 100, (y + 100), (x + 100));
                ctxNextPiece.strokeStyle = '#2a2a30';
                ctxNextPiece.strokeRect(y * 100, x * 100, (y + 100), (x + 100));
            }
            else if (nextPiece[x][y] === 0) {
                ctxNextPiece.fillStyle = '#1E212D';
                ctxNextPiece.fillRect(y * 100, x * 100, (y + 100), (x + 100));
            }
        }
    }
}

function colors(op) { //colors of the pieces
    if (op === 'T') {
        return '#FF69B4';
    }
    if (op === 'Z') {
        return '#00BFFF';
    }
    if (op === 'I') {
        return '#98FB98';
    }
    if (op === 'L') {
        return 'yellow';
    }
    if (op === 'J') {
        return 'orange';
    }
    if (op === 'S') {
        return '#7B68EE';
    }
    if (op === 'O') {
        return '#F5DEB3';
    }
}

function createPiece(op) {//create the pieces by the option
    if (op === 'T') {
        return [[0, 1, 0],
        [1, 1, 1]];
    }
    if (op === 'Z') {
        return [[1, 1, 0],
        [0, 1, 1]];
    }
    if (op === 'I') {
        return [[1, 1, 1, 1]];
    }
    if (op === 'L') {
        return [[1, 0],
        [1, 0],
        [1, 1]];
    }
    if (op === 'J') {
        return [[0, 1],
        [0, 1],
        [1, 1]];
    }
    if (op === 'S') {
        return [[0, 1, 1],
        [1, 1, 0]];
    }
    if (op === 'O') {
        return [[1, 1],
        [1, 1]];
    }
}

function putPieceV1(auxPiece, xAux = null, yAux = null) { //put the pieces in the matrix
    if (xAux === null || yAux === null) {
        xAux = wherePiece().xAux;
        yAux = wherePiece().yAux;
    }

    let right = true
    while (right) {
        if (!collide(auxPiece, xAux, yAux)) {
            right = false;
            clearArena();

            let count1 = 0;
            for (let x = xAux; x <= (xAux + (auxPiece.length - 1)); x++) {
                let count2 = 0;
                for (let y = yAux; y <= (yAux + (auxPiece[0].length - 1)); y++) {
                    matrix[x][y] = auxPiece[count1][count2];
                    count2++;
                }
                count1++;
            }
            piece = auxPiece;
        }
        else if (yAux > ((matrix[0].length - 1) - auxPiece[0].length)) {
            yAux--;
        }
        else {
            right = false;
        }
    }
}

function putPieceV2(piece, xAux, yAux) { //put the pieces in the matrix
    let trying = true;
    let firstTime = true;
    while (trying) {
        if (!collide(piece, xAux, yAux)) {
            trying = false;
            clearArena();
            let count1 = 0;
            for (let x = xAux; x <= (xAux + (piece.length - 1)); x++) {
                let count2 = 0;
                for (let y = yAux; y <= (yAux + (piece[0].length - 1)); y++) {
                    matrix[x][y] = piece[count1][count2];
                    count2++;
                }
                count1++;
            }
            return true;
        }
        if (firstTime) {
            yAux = -1;
            firstTime = false;
        }
        yAux++;
        if (yAux >= matrix[0].length)
            trying = false;
    }

    return false;
}

function defineCanvas() { //define the canvas
    canvas.width = 1200;
    canvas.height = 1600;
    canvas.className = "canvasMobile";
    canvas.id = "game";
    canvas.style = "border-radius: 0 0 2vmin 2vmin;";
    ctx.fillStyle = "#2a2a30";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById("game").parentNode.replaceChild(canvas, document.getElementById("game"));
}

function pause(op) { //pause the game and show the pause modal
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

function gameOver() { //show the gameOver modal
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

    if (sessionStorage.getItem("musicPreference") !== 'false')
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

function ifCatchedTop() { //verify if the pieces catched top
    for (let i = 0; i < matrix[0].length; i++) {
        if (matrix[0][i] !== 0 && matrix[0][i] !== 1) {
            return true;
        }
    }
    return false;
}

function controller() { //set the controller
    document.body.addEventListener('keydown', function (event) {
        const key = event.key;
        if (!isPaused && !isGameOver) {

            if (key === "A" || key === "a" || key === "ArrowLeft") {
                changeDirection('L');
            }
            if (key === "D" || key === "d" || key === "ArrowRight") {
                changeDirection('R');
            }
            if (key === "S" || key === "s" || key === "ArrowDown") {
                downPiece(letter[0]);
            }
            if (key === "E" || key === "e" || key === " " || key === "ArrowUp") {
                let auxPiece = rotatePiece('R', piece)
                putPieceV1(auxPiece);
            }
            if (key === "Q" || key === "q") {
                let auxPiece = rotatePiece('L', piece);
                putPieceV1(auxPiece);
            }
        }
        shadowPiece();
        printGame(letter[0]);
    });
}

function changeDirection(direction) { //change the direction of the piece
    let count = 0;
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            if (direction === "L" && matrix[x][y] === 1 && (checkIfANumber(matrix[x][y - 1]) === false || y === 0)) {
                count++;
            }
        }
    }
    for (let x = 0; x < matrix.length; x++) {
        for (let y = (matrix[x].length - 1); y > 0; y--) {
            if (direction === "R" && matrix[x][y] === 1 && (checkIfANumber(matrix[x][y + 1]) === false || y === (matrix[x].length - 1))) {
                count++;
            }
        }
    }
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            if (matrix[x][y] === 1 && count === 0) {
                if (direction === "L") { //if the piece is not in the left border
                    if (y !== 0) {
                        matrix[x][y] = 0;
                        matrix[x][y - 1] = 1;
                    }
                }
            }
        }
        for (let y = (matrix[x].length - 1); y >= 0; y--) {
            if (direction === "R" && matrix[x][y] === 1 && count === 0) {
                if (direction === "R") {
                    if (y !== (matrix[x].length - 1)) { //if the piece is not in the right border
                        matrix[x][y] = 0;
                        matrix[x][y + 1] = 1;
                    }
                }
            }
        }
    }

    function checkIfANumber(variab) {
        if (variab >= 0 && variab <= 9) {
            return true;
        }
        return false;
    }
}

function rotatePiece(direction, blockAux) { //rotate the piece
    let mRes = [];
    if (direction === 'L') {
        for (let y = (blockAux[0].length - 1); y >= 0; y--) {
            let row = [];
            for (let x = 0; x < (blockAux.length); x++) {
                row.push(blockAux[x][y]);
            }
            mRes.push(row);
        }
    }
    if (direction === 'R') {
        for (let y = 0; y < blockAux[0].length; y++) {
            let row = [];
            for (let x = (blockAux.length - 1); x >= 0; x--) {
                row.push(blockAux[x][y]);
            }
            mRes.push(row);
        }
    }
    return mRes;
}

function collide(piece, xAux, yAux) { //verify if had collide
    for (let x = xAux; x <= (xAux + (piece.length - 1)); x++) {
        for (let y = yAux; y <= (yAux + (piece[0].length - 1)); y++) {
            if (matrix[x][y] !== 1 && matrix[x][y] !== 0 && matrix[x][y] !== 2) {
                return true;
            }
        }
    }
    return false;
}

function clearArena() { // clear all free pieces
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            if (matrix[x][y] === 1) {
                matrix[x][y] = 0;
            }
        }
    }
}

function wherePiece() { //find the x and y position of the piece
    let xAux;
    let yAux = matrix[0].length;

    for (let x = 0; x < matrix.length; x++) {
        if (matrix[x].indexOf(1) !== -1) {
            if (xAux === undefined)
                xAux = x;
            if (matrix[x].indexOf(1) < yAux)
                yAux = matrix[x].indexOf(1);
        }
    }

    return { xAux, yAux };
}

function ifScored() { //verify if the player scored
    let scored = 0;
    while (verifyIfCompleteALine() >= 0) {
        scored += 10;
        matrix = clearLine(matrix, verifyIfCompleteALine());
    }

    if (scored > 0) {
        yesScored();
        printText(scored);
        if (timeLoop > 250) {
            timeLoop -= scored;
            clearInterval(game);
            game = setInterval(gameLoop, timeLoop);
        }
        return true;
    }
    return false;

    function yesScored() {
        gameScore += scored;

        let scores = document.getElementsByClassName("score");
        for (let i = 0; i < scores.length; i++) {
            let Score = parseInt(scores[i].innerHTML) + scored;
            scores[i].innerHTML = Score;
            scores[i].style.color = "#FF9A00"
        }

        if (sessionStorage.getItem("musicPreference") !== 'false')
            setScoredMusic();
    }

    function verifyIfCompleteALine() { //verify if a complete line
        for (let x = (matrix.length - 1); x >= 0; x--) {
            if (matrix[x].indexOf(0) === -1 && matrix[x].indexOf(1) !== 1) {
                //console.log("uma linha completa")
                return x;
            }
        }
        return -1;
    }

    function clearLine(mCL, xAux) {
        let mat = makeMatrix(12, 16);
        for (let x = (matrix.length - 1); x > 0; x--) {
            mat[x] = mCL[x];
        }
        for (let x = (matrix.length - 1); x > 0; x--) {
            if (x <= xAux) {
                mat[x] = mCL[x - 1];
            }
        }
        return mat;
    }

    function setScoredMusic() {
        let music = document.createElement("audio");
        music.src = "./sounds/scored.mp3";
        music.setAttribute("autoplay", "");
        music.id = "scoredMusic";
        if (document.getElementById("scoredMusic"))
            document.getElementById("scoredMusic").parentNode.removeChild(document.getElementById("scoredMusic"));
        document.getElementsByTagName("body")[0].appendChild(music);
    }
}