const {
    defineNewGame,
    setLetter,
    testIfHaveFreePiece,
    shadowPiece,
    pieces,
    putANewPiece,
    ifCatchedTop,
    downPiece,
    changeDirection,
    rotatePiece,
    ifScored
} = require("./gameLogic");

let io;

function startSocketIO(thisio) {
    io = thisio;

    io.on('connection', async (socket) => {
        let gameMatch = null;

        socket.on("start game", async () => {
            gameMatch = defineNewGame(socket.id);
            gameMatch.loop = setInterval(() => gameLoop(gameMatch), gameMatch.timeLoop);
            emitCreatedGame(gameMatch.gameId, socket.id);
        });

        socket.on("change direction of piece", async (op) => {
            if (gameMatch === null)
                return;
            gameMatch.matrix = changeDirection(gameMatch.matrix, op);
            emitGameInfos(gameMatch);
        });

        socket.on("down the piece", async () => {
            if (gameMatch === null)
                return;
            gameMatch.matrix = downPiece(gameMatch.matrix, gameMatch.letter[0]);
            emitGameInfos(gameMatch);
        });

        socket.on("rotate the piece", async (op) => {
            if (gameMatch === null)
                return;
            let resultRotatedPiece = rotatePiece(gameMatch.matrix, op, gameMatch.piece);
            gameMatch.matrix = resultRotatedPiece.matrix;
            gameMatch.piece = resultRotatedPiece.piece;
            emitGameInfos(gameMatch);
        });

        socket.on("pause", async (bool) => {
            if (gameMatch === null)
                return;
            gameMatch.isPaused = bool;
        });

        socket.on('disconnect', (reason) => {
            if (gameMatch === null)
                return;
            clearInterval(gameMatch.loop);
        });

    });
}

function emitGameInfos(gameInfos) {
    let gameInfosJSONString = gameStringify(gameInfos);
    io.emit(gameInfos.gameId + "", gameInfosJSONString);
}

function emitHadAScore(gameId, scored, score) {
    io.emit(gameId + "scored", { scored, score });
}

function emitGameOver(gameId, score) {
    io.emit(gameId + "gameover", score);
}

function emitCreatedGame(gameId, socketId) {
    io.emit(socketId + "created game", gameId);
}

async function gameLoop(thisGame) {
    if (!thisGame.isPaused) {

        emitGameInfos(thisGame);

        let verifyIfScored = ifScored(thisGame.matrix);

        if (testIfHaveFreePiece(thisGame.matrix)) {
            thisGame.matrix = downPiece(thisGame.matrix, thisGame.letter[0]);
        }
        else if (verifyIfScored != false) {
            if (thisGame.timeLoop > 250) {
                thisGame.timeLoop -= 10;
                clearInterval(thisGame.loop);
                thisGame.loop = setInterval(() => gameLoop(thisGame), thisGame.timeLoop);
            }
            thisGame.matrix = verifyIfScored.matrix;
            thisGame.gameScore += verifyIfScored.scored;
            emitHadAScore(thisGame.gameId, verifyIfScored.scored, thisGame.gameScore);
        }
        else {
            if (ifCatchedTop(thisGame.matrix)) {
                clearInterval(thisGame.loop);
                emitGameOver(thisGame.gameId, thisGame.gameScore);
                return;
            }
            thisGame.letter = setLetter(thisGame.letter);
            thisGame.piece = pieces(thisGame.letter[0]);
            thisGame.matrix = putANewPiece(thisGame.matrix, thisGame.piece, 0, 5);
        }
        thisGame.matrix = shadowPiece(thisGame.matrix);

        emitGameInfos(thisGame);
    }
}

function gameStringify(game) {
    gameInfosId = game.gameId;
    let tempLoop = game.loop;
    game.loop = null;
    let gameInfosJSONString = JSON.parse(JSON.stringify(game));
    game.loop = tempLoop;
    return JSON.stringify(gameInfosJSONString);
}

module.exports = {
    startSocketIO
}