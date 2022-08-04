
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

// ---------------------------------- main pages ----------------------------------

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/mainpages/index.html");
});

app.get('/play', (req, res) => {
  res.sendFile(__dirname + "/mainpages/play.html");
});

// app.get('/multiplayer', (req, res) => {
//   res.sendFile(__dirname + "/mainpages/multiplayer.html");
// });

// app.get('/multiplayer/:gameId', (req, res) => {
//   let gameId = req.params['gameId'];
//   res.sendFile(__dirname + "/mainpages/multiplayer.html");
// });

app.use(express.static('assets'));






// let matrixAux = makeMatrixOnline(12, 16)



// function makeMatrixOnline(width, height) { //make the matrix with the width and height for the game
//   let matrix = {};
//   for (let y = 0; y < height; y++) {
//     matrix[y] = new Array();
//     for (let x = 0; x < width; x++) {
//       matrix[y][x] = 0;
//     }
//   }
//   return matrix;
// }

// function ifCatchTop(matrixTop) {
//   for (let i = 0; i < matrixTop[0].length; i++) {
//     if (matrixTop[0][i] !== 0 && matrixTop[0][i] !== 1) {

//       return true;
//     }
//   }
//   return false;
// }


// express js

server.listen(process.env.PORT || 3000, function () {
});

