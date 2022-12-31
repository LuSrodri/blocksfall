
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

function startGameLoop() {
    if (localStorage.getItem("gameSave")) {
        let gameSave = JSON.parse(localStorage.getItem("gameSave"));
        timeLoop = gameSave.timeLoop;
        gameScore = gameSave.score;
        matrix = gameSave.m;
        letter = gameSave.letter;
        piece = gameSave.piece;
    }
    else {
        defineNewGame();
    }

    let scores = document.getElementsByClassName("score");
    for (let i = 0; i < scores.length; i++) {
        scores[i].innerHTML = gameScore;
    }

    game = setInterval(gameLoop, timeLoop);
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

        if (testIfHaveFreePiece(matrix)) {
            downPiece(letter[0]);
        }
        else if (ifScored()) { }
        else {
            if (ifCatchedTop()) {
                isGameOver = true;
                gameOver();
                return;
            }
            setLetter();
            printNextPiece();
            piece = pieces(letter[0]);
            putANewPiece(piece, 0, 5);
        }
        shadowPiece();
        printGame(letter[0]);
    }
}

function defineNewGame() {
    matrix = makeMatrix(12, 16);
    letter = new Array();
    setLetter();
    timeLoop = 750;
    gameScore = 0;
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

function testIfHaveFreePiece(mAux) { //check if exist a free piece in the matrix
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

function pieces(op) {//create the pieces by the option
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

function putAFreePiece(auxPiece, xAux = null, yAux = null) { //put the pieces in the matrix
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

function putANewPiece(piece, xAux, yAux) { //put the pieces in the matrix
    let count1 = 0;
    for (let x = xAux; x <= (xAux + (piece.length - 1)); x++) {
        let count2 = 0;
        for (let y = yAux; y <= (yAux + (piece[0].length - 1)); y++) {
            matrix[x][y] = piece[count1][count2];
            count2++;
        }
        count1++;
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

    shadowPiece();
    printGame(letter[0]);
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

    shadowPiece();
    printGame(letter[0]);

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

    putAFreePiece(mRes);
    shadowPiece();
    printGame(letter[0]);
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
        printInfosByScore(scored);
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

        if (localStorage.getItem("musicPreference") !== 'false')
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