const express = require('express');
const app = express();

app.get('/index', (req, res) => {
  res.redirect('/');
});

app.get('/index.html', (req, res) => {
  res.redirect('/');
});

app.get('/', (req, res) => {
  app.use(express.static('script/menu'));
  app.use(express.static('images/logo'));
  app.use(express.static('images/medals'));
  res.sendFile(__dirname + "/html/index.html");
});

app.get('/play', (req, res) => {
  if (req.headers['user-agent'].indexOf("Mobile") !== -1) {
    app.use(express.static('html/pause'));
    app.use(express.static('script/game-mobile'));
    app.use(express.static('script/menu'));
    app.use(express.static('images/logo'));
    app.use(express.static('images/medals'));
    res.sendFile(__dirname + "/html/mobile.html");
  }
  else{
    app.use(express.static('html/pause'));
    app.use(express.static('script/game'));
    app.use(express.static('script/menu'));
    app.use(express.static('images/logo'));
    app.use(express.static('images/medals'));
    res.sendFile(__dirname + "/html/play.html");
  }
});


app.get('/mobile', (req, res) => {
  res.sendFile(__dirname + "/html/mobile.html");
});

app.get('/manifest.json', (req, res) => {
  res.sendFile(__dirname + "/manifest.json");
});


// app.get('/game.js', (req, res) => {
//   res.sendFile(__dirname + "/script/game.js");
// });

// app.get('/game-mobile.js', (req, res) => {
//   res.sendFile(__dirname + "/script/game-mobile.js");
// });

// app.get('/menu.js', (req, res) => {
//   res.sendFile(__dirname + "/script/menu.js");
// });

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + "/css/style.css");
});

app.get('/style-mobile.css', (req, res) => {
  res.sendFile(__dirname + "/css/style-mobile.css");
});

app.get('/buttons.css', (req, res) => {
  res.sendFile(__dirname + "/css/buttons.css");
});

app.get('/FORCED-SQUARE.ttf', (req, res) => {
  res.sendFile(__dirname + "/fonts/FORCED-SQUARE.ttf");
});

app.get('/control.jpeg', (req, res) => {
  res.sendFile(__dirname + "/images/control.jpeg");
});

app.get('/background-image-blocksfall.jpeg', (req, res) => {
  res.sendFile(__dirname + "/images/background-image-blocksfall.jpeg");
});

// app.get('/blocksfall-logo.png', (req, res) => {
//   res.sendFile(__dirname + "/images/blocksfall-logo.png");
// });

app.get('/icons.css', (req, res) => {
  app.use(express.static('fonts'));
  res.sendFile(__dirname + "/fonts/all.css");
});

// app.get('/music.mp3', (req, res) => {
//   res.sendFile(__dirname + "/music/music.mp3");
// });


// app.get('/lobby', (req, res) =>{
//   app.use(express.static(__dirname+"/css"));
//   app.use(express.static(__dirname+"/images"));
//   app.use(express.static(__dirname+"/script"));

//   res.sendFile(__dirname+"/html/pre_lobby.html");
// });



app.listen(process.env.PORT || 3000, function () {
});
