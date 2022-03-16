

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
  res.sendFile(__dirname + "/html/index.html");
});

app.get('/play', (req, res) => {
  if (req.headers['user-agent'].indexOf("Mobile") !== -1) {
    res.sendFile(__dirname + "/html/mobile.html");
  }
  else {
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

app.get('/blocksfall-logo2.png', (req, res) => {
  res.sendFile(__dirname + "/images/logo/blocksfall-logo2.png");
});

app.get('/1v1BattleLogo.png', (req, res) => {
  res.sendFile(__dirname + "/images/logo/1v1BattleLogo.png");
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
    this.winnerId = null;
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

const { Server } = require("socket.io");

let allGames = null;
let firstTime = true;

let io = null


const observer = docRef.onSnapshot(docSnapshot => {
  allGames = docSnapshot.data().allGames;
  //console.log(allGames);
  if (firstTime === true) {
    setOnConnection();
    firstTime = false;
  }
  for (let i = 0; i < allGames.length; i++) {
    io.to(allGames[i].id).emit('updateServer', allGames[i]);
  }
}, err => {
  //console.log(`Encountered error: ${err}`);
});

function setOnConnection() {

  io = new Server(server);;


  io.on('connection', (socket) => {

    function onUpdateClient(msg) {
      for (let i = 0; i < allGames.length; i++) {
        for (let j = 0; j < allGames[i].users.length; j++) {
          if (allGames[i].users[j].id === socket.id && allGames[i].isRunning === true) {
            allGames[i].users[j].matrix.obj = msg.m;
            allGames[i].users[j].score = msg.scoreGame;
            allGames[i].users[j].letter = msg.letter;
            if (ifCatchTop(allGames[i].users[j].matrix.obj)) {
              allGames[i].users[j].matrix.obj = makeMatrixOnline(12, 16)
              allGames[i].users[j].score = 0
              socket.emit('gameOver', allGames[i]);
            }
            else if (allGames[i].users[j].score >= 150) {
              allGames[i].isRunning = false;
              allGames[i].winnerId = allGames[i].users[j].id;
            }
            //io.to(allGames[i].id).emit("updateServer", allGames[i]);
          }
        }
      }
    }

    socket.on("updateClient", msg => {
      onUpdateClient(msg)
      setAllGames();
    })

    function onStartClient(msg) {
      for (let x = 0; x < allGames.length; x++) {
        if (allGames[x].id === msg.gameId) {
          if (allGames[x].isRunning === false && allGames[x].users.length > 1) {
            let mOnline = new Array();
            mOnline = makeMatrixOnline(12, 16);
            for (let i = 0; i < allGames[x].users.length; i++) {
              allGames[x].users[i].matrix.obj = mOnline;
              allGames[x].users[i].score = 0;
            }
            allGames[x].isRunning = true;
            //io.to(allGames[x].id).emit("updateServer", allGames[x]);
          }
        }
      }
    }

    socket.on("startClient", msg => {
      onStartClient(msg)
      setAllGames();
    })

    function onUserConnected(msg) {

      let users = []

      for (let i = 0; i < allGames.length; i++) {
        for (let j = 0; j < allGames[i].users.length; j++) {
          if (allGames[i].users[j].id === socket.id) {
            return 0;
          }
        }
      }

      if (msg.gameId === -1 || msg.gameId === undefined || msg.gameId === null || !Number.isInteger(msg.gameId)) {
        let randomId = Math.floor(Math.random() * 1000000);
        while (isIdInUse(randomId)) {
          randomId = Math.floor(Math.random() * 1000000);
        }
        let gameMatch1 = new gameMatch(randomId, users);
        let user1 = new user(socket.id, msg.userName, true)
        gameMatch1.users.push(user1)
        allGames.push(gameMatch1);
        socket.join(gameMatch1.id)
        //io.to(gameMatch1.id).emit("updateServer", gameMatch1);
      }
      else {
        if (!isIdInUse(msg.gameId)) {
          let gameMatch1 = new gameMatch(msg.gameId, users);
          let user1 = new user(socket.id, msg.userName, true)
          gameMatch1.users.push(user1)
          allGames.push(gameMatch1);
          socket.join(gameMatch1.id)
          //io.to(gameMatch1.id).emit("updateServer", gameMatch1);
        }
        else {
          for (let i = 0; i < allGames.length; i++) {
            if (allGames[i].id === msg.gameId && allGames[i].users.length < 2) {
              let user1 = new user(socket.id, msg.userName)
              allGames[i].users.push(user1)
              socket.join(allGames[i].id)
              //io.to(allGames[i].id).emit("updateServer", allGames[i]);
            }
            else if (allGames[i].id === msg.gameId && allGames[i].users.length === 2) {
              socket.emit("roomIsFull");
            }
          }
        }
      }
    }

    socket.on("userConnected", msg => {
      onUserConnected(msg)
      setAllGames();
    })

    function onDisconnect() {
      let allGamesLength = allGames.length;
      for (let i = 0; i < allGamesLength; i++) {
        let usersLength = allGames[i].users.length;

        for (let j = 0; j < usersLength; j++) {
          if (allGames[i].users[j].id === socket.id) {
            socket.leave(allGames[i].id);
            allGames[i].users = allGames[i].users.filter((user1) => user1.id !== socket.id)
            usersLength = allGames[i].users.length;
            //io.to(allGames[i].id).emit("updateServer", allGames[i])

            if (allGames[i].users.length === 1) {
              allGames[i].isRunning = false;
              allGames[i].winnerId = null;
              //io.to(allGames[i].id).emit("updateServer", allGames[i])
            }
            else if (allGames[i].users.length === 0) {
              allGames.splice(i, 1);
              allGamesLength = allGames.length;
            }


          }
        }
      }

      for (let i = 0; i < allGames.length; i++) {
        for (let j = 0; j < allGames[i].users.length; j++) {
          if (allGames[i].users.length === 1 && allGames[i].users[j].host === false) {
            allGames[i].users[j].host = true;
            //io.to(allGames[i].id).emit("updateServer", allGames[i])
          }
        }
      }
    }

    socket.on('disconnect', () => {
      onDisconnect()
      setAllGames()
    });
  })
}

async function setAllGames() {
  for (let i = 0; i < allGames.length; i++) {
    allGames[i] = JSON.parse(JSON.stringify(allGames[i]))
  }
  let allGamesAux = {}
  allGamesAux.allGames = allGames;
  const res = await docRef.set(allGamesAux, { merge: true });
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

