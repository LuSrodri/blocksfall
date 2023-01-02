
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

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

function printGame(letterPrinting, matrix) { //print the game with the colors of the pieces
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            if (matrix[x][y] === 1) {
                ctx.fillStyle = colors(letterPrinting);
                ctx.fillRect(y * 100, x * 100, (y + 100), (x + 100));
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
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
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.strokeRect(y * 100, x * 100, (y + 100), (x + 100));
        }
    }
}

function printNextPiece(letterOfNextPiece) {
    let canvasNextPiece = document.getElementById("nextPiece");
    let nextPiece = pieces(letterOfNextPiece);

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
                ctxNextPiece.fillStyle = colors(letterOfNextPiece);
                ctxNextPiece.fillRect(y * 100, x * 100, (y + 100), (x + 100));
                ctxNextPiece.strokeStyle = '#000000';
                ctxNextPiece.lineWidth = 3;
                ctxNextPiece.strokeRect(y * 100, x * 100, (y + 100), (x + 100));
            }
            else if (nextPiece[x][y] === 0) {
                ctxNextPiece.fillStyle = '#1E212D';
                ctxNextPiece.fillRect(y * 100, x * 100, (y + 100), (x + 100));
            }
        }
    }
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