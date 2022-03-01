

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('./path/to/fair-gradient-335401-0979c95b74d3.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();


app.get('/index', (req, res) => {
  res.redirect('/');
});

app.get('/index.html', (req, res) => {
  res.redirect('/');
});

app.get('/', (req, res) => {
  app.use(express.static('script/game'));
  app.use(express.static('script/game-mobile'));
  app.use(express.static('script/menu'));
  app.use(express.static('images/logo'));
  res.sendFile(__dirname + "/html/index.html");
});

app.get('/play', (req, res) => {
  if (req.headers['user-agent'].indexOf("Mobile") !== -1) {
    app.use(express.static('script/game-mobile'));
    app.use(express.static('script/menu'));
    app.use(express.static('images/logo'));
    res.sendFile(__dirname + "/html/mobile.html");
  }
  else {
    app.use(express.static('script/game'));
    app.use(express.static('script/menu'));
    app.use(express.static('images/logo'));
    res.sendFile(__dirname + "/html/play.html");
  }
});

app.get('/playOnline.html', (req, res) => {
  if (req.headers['user-agent'].indexOf("Mobile") !== -1) {
    res.sendFile(__dirname + "/html/mobileOnline.html");
  }
  else {
    res.sendFile(__dirname + "/html/playOnline.html");
  }
});

app.get('/game-online.js', (req, res) => {
  res.sendFile(__dirname + "/script/online/game-online.js");
});

app.get('/multiplayer', (req, res) => {
  app.use(express.static('images/logo'));
  res.sendFile(__dirname + "/html/multiplayer.html");
});

app.get('/gameoverOnline.html', (req, res) => {
  res.sendFile(__dirname + "/html/pause/gameoverOnline.html");
});


app.get('/mobile', (req, res) => {
  res.sendFile(__dirname + "/html/mobile.html");
});

app.get('/manifest.json', (req, res) => {
  res.sendFile(__dirname + "/manifest.json");
});


app.get('/game.js', (req, res) => {
  res.sendFile(__dirname + "/script/game/game.js");
});

app.get('/game-mobile.js', (req, res) => {
  res.sendFile(__dirname + "/script/game-mobile/game-mobile.js");
});

app.get('/canvasHome.js', (req, res) => {
  res.sendFile(__dirname + "/script/canvasHome/canvasHome.js");
});

app.get('/menu.js', (req, res) => {
  res.sendFile(__dirname + "/script/menu/menu.js");
});

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + "/css/style.css");
});

// app.get('/FORCED-SQUARE.ttf', (req, res) => {
//   res.sendFile(__dirname + "/fonts/FORCED-SQUARE.ttf");
// });

app.get('/oswald.ttf', (req, res) => {
  res.sendFile(__dirname + "/fonts/Oswald-VariableFont_wght.ttf");
});

app.get('/control.jpeg', (req, res) => {
  res.sendFile(__dirname + "/images/control.jpeg");
});

app.get('/background-image-blocksfall.jpeg', (req, res) => {
  res.sendFile(__dirname + "/images/background-image-blocksfall.jpeg");
});

app.get('/blocksfall-logo.png', (req, res) => {
  res.sendFile(__dirname + "/images/logo/blocksfall-logo.png");
});

app.get('/congratulations.gif', (req, res) => {
  res.sendFile(__dirname + "/images/congratulations.gif");
});

// app.get('/blocksfall-logo.png', (req, res) => {
//   res.sendFile(__dirname + "/images/blocksfall-logo.png");
// });

app.get('/icons.css', (req, res) => {
  app.use(express.static('fonts'));
  res.sendFile(__dirname + "/fonts/all.css");
});

app.get('/bronze_medal.png', (req, res) => {
  res.sendFile(__dirname + "/images/medals/bronze_medal.png");
});

app.get('/silver_medal.png', (req, res) => {
  res.sendFile(__dirname + "/images/medals/silver_medal.png");
});

app.get('/gold_medal.png', (req, res) => {
  res.sendFile(__dirname + "/images/medals/gold_medal.png");
});

app.get('/music.mpeg', (req, res) => {
  res.sendFile(__dirname + "/music/music.mpeg");
});

app.get('/finalMusic.mp3', (req, res) => {
  res.sendFile(__dirname + "/music/scoredSound.mp3");
});



app.get('/pause.html', (req, res) => {
  res.sendFile(__dirname + "/html/pause/pause.html");
});

app.get('/gameover.html', (req, res) => {
  res.sendFile(__dirname + "/html/pause/gameover.html");
});

// app.get('/lobby', (req, res) =>{
//   app.use(express.static(__dirname+"/css"));
//   app.use(express.static(__dirname+"/images"));
//   app.use(express.static(__dirname+"/script"));

//   res.sendFile(__dirname+"/html/pre_lobby.html");
// });

let matrixAux = makeMatrixOnline(12, 16)

let user = class user {
  constructor(id, name, host = false) {
    this.id = id
    this.name = name;
    this.matrix = { obj: matrixAux };
    this.score = 0;
    this.host = host;
    this.letter = null;
  }
};

let gameMatch = class gameMatch {
  constructor(id, users) {
    this.id = id
    this.users = users;
    this.isRunning = false;
  }
}

function makeMatrixOnline(width, height) { //make the matrix with the width and height for the game
  let matrix = {};
  for (let y = 0; y < height; y++) {
    matrix[y] = new Array();
    for (let x = 0; x < width; x++) {
      matrix[y][x] = 0;
    }
  }
  return matrix;
}

function ifCatchTop(matrixTop) {
  for (let i = 0; i < matrixTop[0].length; i++) {
    if (matrixTop[0][i] !== 0 && matrixTop[0][i] !== 1) {

      return true;
    }
  }
  return false;
}

const docRef = db.collection('blocksfall').doc('allGames');

let allGames = null;

let allGamesAux = {}


const { Server } = require("socket.io");
let io = {}

function getAllGamesFromDataBase() {
  return new Promise(resolve => {
    db.collection('blocksfall').get().then(snapshot => {
      snapshot.forEach((doc) => {
        allGamesAux = doc.data()
      });
      allGames = allGamesAux.allGames
      io = new Server(server);



      io.on('connection', (socket) => {


        socket.on("reconnecting", (msg) => {
          for (let x = 0; x < allGames.length; x++) {
            for (let y = 0; y < allGames[x].users.length; y++) {
              if (allGames[x].users[y].id === msg) {
                allGames[x].users[y].id = socket.id
                if (allGames[x].isRunning === true) {
                  socket.join(allGames[x].id);
                  io.to(allGames[x].id).emit("updateServer", allGames[x].users);
                }
              }
            }
          }
          setAllGames()

        })

        // setInterval(() => {
        //   console.log("online games: " + allGames.length);
        //   console.log("opened rooms: " + socket.rooms.size);
        // }, 1000)

        //console.log('a user connected');

        socket.on("updateClient", msg => {

          for (let i = 0; i < allGames.length; i++) {
            if (allGames[i].id === msg.gameId) {
              for (let j = 0; j < allGames[i].users.length; j++) {
                if (allGames[i].users[j].id === socket.id) {
                  allGames[i].users[j].matrix.obj = msg.m;
                  allGames[i].users[j].score = msg.scoreGame;
                  allGames[i].users[j].letter = msg.letter;
                  if (ifCatchTop(allGames[i].users[j].matrix.obj)) {
                    allGames[i].users[j].matrix.obj = makeMatrixOnline(12, 16)
                    allGames[i].users[j].score = 0
                    io.to(allGames[i].id).emit("gameOver", allGames[i].users);
                  }
                  else if (allGames[i].users[j].score >= 150) {
                    allGames[i].isRunning = false;
                    io.to(allGames[i].id).emit("playerWinner", { users: allGames[i].users, winnerId: allGames[i].users[j].id });
                  }
                  else {
                    io.to(allGames[i].id).emit("updateServer", allGames[i].users);
                  }
                }
              }
            }

          }
          setAllGames()
        })

        socket.on("startClient", msg => {

          for (let x = 0; x < allGames.length; x++) {
            if (allGames[x].id === msg.gameId) {
              if (allGames[x].isRunning === false) {
                let mOnline = new Array();
                mOnline = makeMatrixOnline(12, 16);
                for (let i = 0; i < allGames[x].users.length; i++) {
                  allGames[x].users[i].matrix.obj = mOnline;
                  allGames[x].users[i].score = 0;
                }
                allGames[x].isRunning = true;
                io.to(allGames[x].id).emit("startGame", allGames[x]);
              }
            }
          }
          setAllGames()
        })

        socket.on("userConnected", msg => {

          let users = []

          if (msg.gameId === -1 || msg.gameId === undefined || msg.gameId === null || !Number.isInteger(msg.gameId)) {
            let randomId = Math.floor(Math.random() * 1000000);
            while (isIdInUse(randomId)) {
              randomId = Math.floor(Math.random() * 1000000);
            }
            if (!isIdInUse(randomId)) {
              let gameMatch1 = new gameMatch(randomId, users);
              let user1 = new user(socket.id, msg.userName, true)
              gameMatch1.users.push(user1)
              socket.join(randomId)
              io.to(randomId).emit("userList", gameMatch1);
              // socket.emit("userList", gameMatch1)
              // socket.broadcast.emit("userList", gameMatch1)
              allGames.push(gameMatch1);
            }
          }
          else {
            if (!isIdInUse(msg.gameId)) {
              let gameMatch1 = new gameMatch(msg.gameId, users);
              let user1 = new user(socket.id, msg.userName, true)
              gameMatch1.users.push(user1)
              socket.join(msg.gameId)
              io.to(msg.gameId).emit("userList", gameMatch1);
              // socket.emit("userList", gameMatch1)
              // socket.broadcast.emit("userList", gameMatch1)
              allGames.push(gameMatch1);
            }
            else {
              for (let i = 0; i < allGames.length; i++) {
                if (allGames[i].id === msg.gameId && allGames[i].users.length < 2) {
                  let user1 = new user(socket.id, msg.userName)
                  user1.matrix.obj = makeMatrixOnline(12, 16);
                  allGames[i].users.push(user1)
                  socket.join(msg.gameId)
                  io.to(msg.gameId).emit("userList", allGames[i]);
                  if (allGames[i].isRunning === true) {
                    io.to(allGames[i].id).emit("startGame", allGames[i]);
                  }
                  // socket.emit("userList", allGames[i])
                  // socket.broadcast.emit("userList", allGames[i])
                }
                else {
                  socket.emit("roomIsFull");
                }
              }
            }
          }
          setAllGames()

        })

        function disconnect() {
          let allGamesLength = allGames.length;
          for (let i = 0; i < allGamesLength; i++) {
            let usersLength = allGames[i].users.length;


            if (true) {  //allGames[i].isRunning === false) {
              for (let j = 0; j < usersLength; j++) {
                if (allGames[i].users[j].id === socket.id) {
                  socket.leave(allGames[i].id);
                  allGames[i].users = allGames[i].users.filter((user1) => user1.id !== socket.id)
                  usersLength = allGames[i].users.length;
                  if (usersLength <= 1 && allGames[i].isRunning === true) {
                    allGames[i].isRunning = false;
                  }
                  if (allGames[i].users[j] !== undefined) {
                    if (allGames[i].users.length === 1 && allGames[i].users[j].host === false) {
                      allGames[i].users[j].host = true;
                    }
                  }
                  if (allGames[i].users.length === 0) {
                    allGames.splice(i, 1);
                    allGamesLength = allGames.length;
                  }
                  else {
                    for (let x = 0; x < allGames[i].users.length; x++) {
                      io.to(allGames[i].users[x].id).emit("userList", allGames[i])
                    }
                  }
                }

              }
            }


          }
          //console.log('user disconnected');
          setAllGames()
        }


        socket.on('disconnect', () => {
          disconnect();
        });

        socket.on("connect_error", () => {
          disconnect();
        });

        socket.on("disconnecting", () => {
          disconnect();
        });


      });




      resolve()
    });
  })

}

getAllGames()

async function getAllGames() {
  await getAllGamesFromDataBase()
}

function setAllGamesFromDataBase() {
  return new Promise(resolve => {
    for (let i = 0; i < allGames.length; i++) {
      allGames[i] = JSON.parse(JSON.stringify(allGames[i]))
    }

    docRef.set({
      allGames
    }).then(() => {
      resolve()
    })
  })
}

async function setAllGames() {
  if (allGames !== null) {
    await setAllGamesFromDataBase()
  }
}


// verify if the randomId is already in use
function isIdInUse(id) {
  for (let i = 0; i < allGames.length; i++) {
    if (allGames[i].id === id) {
      return true;
    }
  }
  return false;
}

server.listen(process.env.PORT || 3000, function () {
});

