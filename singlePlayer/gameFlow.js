
const { CreateAGameInDataBase, GetAGameInDatabase, UpdateAGameInDataBase, DeleteAGameInDataBase } = require("./database");
const { gameStringify } = require("./util");
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
        // console.log('a user connected: ' + socket.id);

        socket.on("start game", async (gameId) => {
            if (gameId === null || gameId === undefined)
                return;

            if (gameId === "") {
                gameMatch = defineNewGame(socket.id);
                gameMatch.loop = setInterval(() => gameLoop(gameMatch), gameMatch.timeLoop);
                gameMatch.gameId = await CreateAGameInDataBase(gameMatch);
                emitCreatedGame(gameMatch.gameId, socket.id);
            }
            else if (await GetAGameInDatabase(gameId)) {
                gameMatch = await GetAGameInDatabase(gameId);
                gameMatch.loop = setInterval(() => gameLoop(gameMatch), gameMatch.timeLoop);
                gameMatch.isPaused = false;
                emitCreatedGame(gameMatch.gameId, socket.id);
            }
            else {
                gameMatch = defineNewGame(socket.id);
                gameMatch.loop = setInterval(() => gameLoop(gameMatch), gameMatch.timeLoop);
                gameMatch.gameId = await CreateAGameInDataBase(gameMatch);
                emitCreatedGame(gameMatch.gameId, socket.id);
            }
        });

        socket.on("change direction of piece", async (op) => {
            if (gameMatch === null)
                return;
            gameMatch.matrix = changeDirection(gameMatch.matrix, op);
            UpdateAGameInDataBase(gameMatch);
            emitGameInfos(gameMatch);
        });

        socket.on("down the piece", async () => {
            if (gameMatch === null)
                return;
            gameMatch.matrix = downPiece(gameMatch.matrix, gameMatch.letter[0]);
            UpdateAGameInDataBase(gameMatch);
            emitGameInfos(gameMatch);
        });

        socket.on("rotate the piece", async (op) => {
            if (gameMatch === null)
                return;
            let resultRotatedPiece = rotatePiece(gameMatch.matrix, op, gameMatch.piece);
            gameMatch.matrix = resultRotatedPiece.matrix;
            gameMatch.piece = resultRotatedPiece.piece;
            UpdateAGameInDataBase(gameMatch);
            emitGameInfos(gameMatch);
        });

        socket.on("pause", async (bool) => {
            if (gameMatch === null)
                return;
            gameMatch.isPaused = bool;
            UpdateAGameInDataBase(gameMatch);
        });

        socket.on("delete gameSave", async (gameId) => {
            await DeleteAGameInDataBase(gameId);
        });

        socket.on('disconnect', (reason) => {
            // console.log('user disconnected: ' + socket.id + " by " + reason);
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
        UpdateAGameInDataBase(thisGame);

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
                setTimeout(async () => await DeleteAGameInDataBase(thisGame.gameId), 1000);
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

module.exports = {
    startSocketIO
}