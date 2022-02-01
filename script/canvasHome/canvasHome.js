


let mHome = new Array();
let ctxHome = null

if (document.getElementById("canvasHome")) {
    const canvasHome = document.createElement('canvas');
    ctxHome = canvasHome.getContext('2d');

    canvasHome.width = 1000;
    canvasHome.height = 500;

    canvasHome.id = "canvasHome"

    ctxHome.fillStyle = "#2a2a30";
    ctxHome.fillRect(0, 0, canvasHome.width, canvasHome.height);
    document.getElementById("canvasHome").parentNode.replaceChild(canvasHome, document.getElementById("canvasHome"));

    mHome = makeMatrixHome(10, 7);

    let letters = ['T', 'Z', 'I', 'L', 'J', 'S', 'O'];
    let letter = null

    let random = Math.floor(Math.random() * letters.length);
    letter = letters[random];
    let block = createBlockHome(letter);
    let randomNumberHome = Math.round((Math.random() * (8 - 3 + 1) + 3))
    putPieceHome(block, 0, 3);
    printGameHome(letter)

    setInterval(() => {
        randomNumberHome = Math.round((Math.random() * (6 - 3 + 1) + 3))
        let random = Math.floor(Math.random() * letters.length);
        letter = letters[random];
        let block = createBlockHome(letter);
        putPieceHome(block, 0, randomNumberHome);
        printGameHome(letter)
    }, 4000);

    setInterval(() => {
        downPieceHome(letter)
        printGameHome(letter)
    }, 500);

}



function makeMatrixHome(width, height) { //make the matrix with the width and height for the game
    let matrix = new Array();
    for (let y = 0; y < height; y++) {
        matrix[y] = new Array();
        for (let x = 0; x < width; x++) {
            matrix[y][x] = 0;
        }
    }
    return matrix;
}


function createBlockHome(op) {//create the pieces by the option
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


function putPieceHome(blockpp, xAux, yAux) { //put the pieces in the matrix

    // xAux = Math.floor(xAux);
    // yAux = Math.floor(yAux);

    let right = true
    while (right) {

        right = false;

        let count1 = 0;
        for (let x = xAux; x <= (xAux + (blockpp.length - 1)); x++) {
            let count2 = 0;
            for (let y = yAux; y <= (yAux + (blockpp[0].length - 1)); y++) {
                mHome[x][y] = blockpp[count1][count2];
                count2++;
            }
            count1++;
        }

        right = false;
    }
}

function downPieceHome(letter) { //move the piece down

    let length = (mHome.length - 1);


    for (let x = (length); x >= 0; x--) {
        for (let y = 0; y < mHome[x].length; y++) {
            if (x !== (length)) {
                if (mHome[x][y] === 1) {
                    mHome[x + 1][y] = 1;
                    mHome[x][y] = 0;
                }
            }
            else {
                if (mHome[x][y] === 1) {
                    mHome[x][y] = 0;
                }
            }
        }
    }


}

function printGameHome(letter) { //print the game with the colorsHome of the pieces

    for (let x = 0; x < mHome.length; x++) {
        for (let y = 0; y < mHome[x].length; y++) {

            if (mHome[x][y] === 0) {
                ctxHome.fillStyle = '#2a2a30';
                ctxHome.fillRect(y * 80, x * 80, (y + 80), (x + 80));
                ctxHome.strokeStyle = '#2a2a30';
                ctxHome.strokeRect(y * 80, x * 80, (y + 80), (x + 80));
            }

            if (mHome[x][y] === 1) {
                ctxHome.fillStyle = colorsHome(letter);
                ctxHome.fillRect(y * 80, x * 80, (y + 80), (x + 80));
                ctxHome.strokeStyle = '#2a2a30';
                ctxHome.strokeRect(y * 80, x * 80, (y + 80), (x + 80));
            }

        }
    }

}

function colorsHome(op) { //change the colorsHome of the pieces
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