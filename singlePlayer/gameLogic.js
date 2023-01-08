
let letters = ['T', 'Z', 'I', 'L', 'J', 'S', 'O'];

function defineNewGame(gameIdStart) {
    let newGame = {};
    newGame.matrix = makeMatrix(12, 16);
    newGame.letter = new Array();
    newGame.letter = setLetter(newGame.letter);
    newGame.timeLoop = 750;
    newGame.loop = null;
    newGame.gameScore = 0;
    newGame.gameId = gameIdStart;
    newGame.piece = pieces(newGame.letter[0])
    newGame.isPaused = false;

    return newGame;
}

function setLetter(letter) {
    let lettersIndex = Math.floor(Math.random() * letters.length);;
    if (letter.length === 0) {
        letter.push(letters[lettersIndex]);
        lettersIndex = Math.floor(Math.random() * letters.length);
        letter.push(letters[lettersIndex]);

        return letter;
    }
    letter.shift();
    letter.push(letters[lettersIndex]);

    return letter;
}

function makeMatrix(width, height) {
    let matrix = new Array();
    for (let y = 0; y < height; y++) {
        matrix[y] = new Array();
        for (let x = 0; x < width; x++) {
            matrix[y][x] = 0;
        }
    }

    return matrix;
}

function testIfHaveFreePiece(mAux) {
    let count = 0;
    let length = (mAux.length - 1);
    for (let x = length; x >= 0; x--) {
        if (mAux[x].indexOf(1) !== -1) {
            count++;
        }
    }
    if (count > 0) {
        return true;
    }
    return false;
}

function shadowPiece(mAux) {
    for (let x = 0; x < mAux.length; x++) {
        for (let y = 0; y < mAux[x].length; y++) {
            if (mAux[x][y] === 1) {
                for (let z = (x + 1); z < mAux.length; z++) {
                    if (mAux[z][y] === 0) {
                        mAux[z][y] = 2;
                    }
                }
            }
            else if (mAux[x][y] !== 1 && mAux[x][y] !== 2) {
                for (let z = (x + 1); z < mAux.length; z++) {
                    if (mAux[z][y] === 2) {
                        mAux[z][y] = 0;
                    }
                }
            }
        }
    }

    return mAux;
}

function pieces(op) {
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

function putAFreePiece(mAux, pieceAux, xAux = null, yAux = null) {
    if (xAux === null || yAux === null) {
        xAux = wherePiece(mAux).xAux;
        yAux = wherePiece(mAux).yAux;
    }

    let right = true
    while (right) {
        if (!collide(mAux, pieceAux, xAux, yAux)) {
            right = false;
            mAux = clearArena(mAux);

            let count1 = 0;
            for (let x = xAux; x <= (xAux + (pieceAux.length - 1)); x++) {
                let count2 = 0;
                for (let y = yAux; y <= (yAux + (pieceAux[0].length - 1)); y++) {
                    mAux[x][y] = pieceAux[count1][count2];
                    count2++;
                }
                count1++;
            }
            return mAux;
        }
        else if (yAux > ((mAux[0].length - 1) - pieceAux[0].length)) {
            yAux--;
        }
        else {
            right = false;
        }
    }

    return false;
}

function putANewPiece(mAux, pieceAux, xAux, yAux) {
    let count1 = 0;
    for (let x = xAux; x <= (xAux + (pieceAux.length - 1)); x++) {
        let count2 = 0;
        for (let y = yAux; y <= (yAux + (pieceAux[0].length - 1)); y++) {
            mAux[x][y] = pieceAux[count1][count2];
            count2++;
        }
        count1++;
    }

    return mAux;
}

function ifCatchedTop(mAux) {
    for (let i = 0; i < mAux[0].length; i++) {
        if (mAux[0][i] !== 0 && mAux[0][i] !== 1) {
            return true;
        }
    }
    return false;
}

function downPiece(mAux, letterAux) {
    let length = (mAux.length - 1);
    let count = 0;

    for (let x = 0; x <= length; x++) {
        for (let y = 0; y < mAux[x].length; y++) {
            if (x !== (length)) {
                if (mAux[x][y] === 1) {
                    if (mAux[x + 1][y] !== 1 && mAux[x + 1][y] !== 0 && mAux[x + 1][y] !== 2) {
                        count++;
                    }
                }
            }
        }
    }
    if (mAux[length].indexOf(1) !== -1) {
        count++;
    }

    if (count > 0) {
        for (let x = (length); x >= 0; x--) {
            for (let y = 0; y < mAux[x].length; y++) {
                if (mAux[x][y] === 1) {
                    mAux[x][y] = letterAux;
                }
            }
        }
    }
    else {
        for (let x = (length); x >= 0; x--) {
            for (let y = 0; y < mAux[x].length; y++) {
                if (mAux[x][y] === 1) {
                    mAux[x + 1][y] = 1;
                    mAux[x][y] = 0;
                }
            }
        }
    }

    mAux = shadowPiece(mAux);

    return mAux;
}

function changeDirection(mAux, direction) {
    let count = 0;
    for (let x = 0; x < mAux.length; x++) {
        for (let y = 0; y < mAux[x].length; y++) {
            if (direction === "L" && mAux[x][y] === 1 && (checkIfANumber(mAux[x][y - 1]) === false || y === 0)) {
                count++;
            }
        }
    }
    for (let x = 0; x < mAux.length; x++) {
        for (let y = (mAux[x].length - 1); y > 0; y--) {
            if (direction === "R" && mAux[x][y] === 1 && (checkIfANumber(mAux[x][y + 1]) === false || y === (mAux[x].length - 1))) {
                count++;
            }
        }
    }
    for (let x = 0; x < mAux.length; x++) {
        for (let y = 0; y < mAux[x].length; y++) {
            if (mAux[x][y] === 1 && count === 0) {
                if (direction === "L") {
                    if (y !== 0) {
                        mAux[x][y] = 0;
                        mAux[x][y - 1] = 1;
                    }
                }
            }
        }
        for (let y = (mAux[x].length - 1); y >= 0; y--) {
            if (direction === "R" && mAux[x][y] === 1 && count === 0) {
                if (direction === "R") {
                    if (y !== (mAux[x].length - 1)) {
                        mAux[x][y] = 0;
                        mAux[x][y + 1] = 1;
                    }
                }
            }
        }
    }

    mAux = shadowPiece(mAux);

    return mAux;

    function checkIfANumber(variab) {
        if (variab >= 0 && variab <= 9) {
            return true;
        }
        return false;
    }
}

function rotatePiece(mAux, direction, pieceAux) {
    if (!pieceAux) {
        return;
    }

    let pieceRotated = [];
    if (direction === 'L') {
        for (let y = (pieceAux[0].length - 1); y >= 0; y--) {
            let row = [];
            for (let x = 0; x < (pieceAux.length); x++) {
                row.push(pieceAux[x][y]);
            }
            pieceRotated.push(row);
        }
    }
    if (direction === 'R') {
        for (let y = 0; y < pieceAux[0].length; y++) {
            let row = [];
            for (let x = (pieceAux.length - 1); x >= 0; x--) {
                row.push(pieceAux[x][y]);
            }
            pieceRotated.push(row);
        }
    }

    let resultMatrix = putAFreePiece(mAux, pieceRotated);
    if (resultMatrix === false)
        return { matrix: mAux, piece: pieceAux };

    resultMatrix = shadowPiece(resultMatrix);

    return { matrix: resultMatrix, piece: pieceRotated };
}

function collide(mAux, pieceAux, xAux, yAux) {
    for (let x = xAux; x <= (xAux + (pieceAux.length - 1)); x++) {
        if (mAux[x] === undefined) {
            return true;
        }
        for (let y = yAux; y <= (yAux + (pieceAux[0].length - 1)); y++) {
            if (mAux[x][y] === undefined) {
                return true;
            }
            if (mAux[x][y] !== 1 && mAux[x][y] !== 0 && mAux[x][y] !== 2) {
                return true;
            }
        }
    }
    return false;
}

function clearArena(mAux) {
    for (let x = 0; x < mAux.length; x++) {
        for (let y = 0; y < mAux[x].length; y++) {
            if (mAux[x][y] === 1) {
                mAux[x][y] = 0;
            }
        }
    }

    return mAux;
}

function wherePiece(mAux) {
    let xAux;
    let yAux = mAux[0].length;

    for (let x = 0; x < mAux.length; x++) {
        if (mAux[x].indexOf(1) !== -1) {
            if (xAux === undefined)
                xAux = x;
            if (mAux[x].indexOf(1) < yAux)
                yAux = mAux[x].indexOf(1);
        }
    }

    return { xAux, yAux };
}

function ifScored(mAux) {
    let scored = 0;
    while (verifyIfCompleteALine(mAux) >= 0) {
        scored += 10;
        mAux = clearLine(mAux, verifyIfCompleteALine(mAux));
    }

    if (scored > 0) {
        return {matrix: mAux, scored};
    }
    return false;

    function verifyIfCompleteALine(mAux) {
        for (let x = (mAux.length - 1); x >= 0; x--) {
            if (mAux[x].indexOf(0) === -1 && mAux[x].indexOf(1) !== 1) {
                return x;
            }
        }
        return -1;
    }

    function clearLine(mAux, xAux) {
        let mat = makeMatrix(12, 16);
        for (let x = (mAux.length - 1); x > 0; x--) {
            mat[x] = mAux[x];
        }
        for (let x = (mAux.length - 1); x > 0; x--) {
            if (x <= xAux) {
                mat[x] = mAux[x - 1];
            }
        }
        return mat;
    }

}

module.exports = {
    defineNewGame,
    setLetter,
    makeMatrix,
    testIfHaveFreePiece,
    shadowPiece,
    pieces,
    putAFreePiece,
    putANewPiece,
    ifCatchedTop,
    downPiece,
    changeDirection,
    rotatePiece,
    collide,
    clearArena,
    wherePiece,
    ifScored
}