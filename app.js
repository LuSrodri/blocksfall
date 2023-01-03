
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const {
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
} = require("./gameLogic");
const gameMatches = [];

mainPage: {
  app.get('/', (req, res) => {
    res.sendFile(__dirname + "/mainpages/index.html");
  });

  app.get('/play', (req, res) => {
    res.sendFile(__dirname + "/mainpages/play.html");
  });
}

assets: {
  app.use(express.static('assets'));

  app.get('/blocksfall-logo.png', (req, res) => {
    res.sendFile(__dirname + "/assets/images/logo/blocksfall-logo.png");
  });
}

socketio: {

  io.on('connection', (socket) => {
    console.log('a user connected: ' + socket.id);

    let gameMatch = null;

    socket.on("start game", (gameId) => {
      if (gameId === "") {
        gameMatch = defineNewGame(socket.id);
        gameMatch.loop = setInterval(() => gameLoop(gameMatch), gameMatch.timeLoop);
        gameMatches.push(gameMatch);
      }
      else if (gameMatches.find(x => x.gameId === gameId)) {
        gameMatch = gameMatches.find(x => x.gameId === gameId);
        gameMatch.gameId = socket.id;
        gameMatch.loop = setInterval(() => gameLoop(gameMatch), gameMatch.timeLoop);
      }
      else {
        gameMatch = defineNewGame(socket.id);
        gameMatch.loop = setInterval(() => gameLoop(gameMatch), gameMatch.timeLoop);
        gameMatches.push(gameMatch);
      }
    });

    socket.on("change direction of piece", (op) => {
      gameMatch.matrix = changeDirection(gameMatch.matrix, op);
      emitGameInfos(gameMatch);
    });

    socket.on("down the piece", () => {
      gameMatch.matrix = downPiece(gameMatch.matrix, gameMatch.letter[0]);
      emitGameInfos(gameMatch);
    });

    socket.on("rotate the piece", (op) => {
      let resultRotatedPiece = rotatePiece(gameMatch.matrix, op, gameMatch.piece);
      gameMatch.matrix = resultRotatedPiece.matrix;
      gameMatch.piece = resultRotatedPiece.piece;
      emitGameInfos(gameMatch);
    });

    socket.on("pause", (bool) => {
      gameMatch.isPaused = bool;
    });

    socket.on('disconnect', () => {
      console.log('user disconnected: ' + socket.id);
      clearInterval(gameMatch.loop);
      gameMatch.isPaused = false;
    });
  });

  function emitGameInfos(gameInfos) {
    gameInfosId = gameInfos.gameId;
    let tempLoop = gameInfos.loop;
    gameInfos.loop = null;
    let gameInfosJSONString = JSON.parse(JSON.stringify(gameInfos));
    gameInfos.loop = tempLoop;
    gameInfosJSONString = JSON.stringify(gameInfosJSONString);
    io.emit(gameInfosId + "", gameInfosJSONString);
  }

  function emitHadAScore(gameId, score) {
    io.emit(gameId + "scored", score);
  }

  function emitGameOver(gameId, score) {
    io.emit(gameId + "gameover", score);
  }
}

game: {

  function gameLoop(thisGame) {
    if (!thisGame.isPaused) {
      gameMatches[gameMatches.findIndex(x => x.gameId === thisGame.gameId)] = thisGame;

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
        emitHadAScore(thisGame.gameId, thisGame.gameScore);
      }
      else {
        if (ifCatchedTop(thisGame.matrix)) {
          emitGameOver(thisGame.gameId, thisGame.gameScore);
          clearInterval(thisGame.loop);
          gameMatches.splice(gameMatches.findIndex(x => x.gameId === thisGame.gameId), 1);
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

}

other: {
  app.get("/greetings", (req, res) => {
    res.send({ greetings: process.env.GREETINGS || "" });
  });
}

server.listen(process.env.PORT || 3000, function () {
});