
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  pingTimeout: 1000,
  pingInterval: 1000
});
require('./singlePlayer/gameFlow').startSocketIO(io);

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

other: {
  app.get("/greetings", (req, res) => {
    res.send({ greetings: process.env.GREETINGS || "" });
  });
}

app.get('/ads.txt', (req, res) => {
  res.sendFile(__dirname + "/ads.txt");
});

server.listen(process.env.PORT || 3000, function () {
});