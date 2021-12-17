const express = require('express');
const app = express();

app.get('/index', (req, res) => {
  res.redirect('/');
});

app.get('/index.html', (req, res) => {
  res.redirect('/');
});

app.get('/', (req, res) => {

  if (req.headers['sec-ch-ua-mobile'] !== "?0") {
    res.sendFile(__dirname + "/html/inSoonMobile.html");
  }
  else{
    res.sendFile(__dirname + "/html/index.html");
  }
});

app.get('/play', (req, res) => {
  if (req.headers['sec-ch-ua-mobile'] !== "?0") {
    res.sendFile(__dirname + "/html/inSoonMobile.html");
  }
  else{
    res.sendFile(__dirname + "/html/play.html");
  }
});




app.get('/game.js', (req, res) => {
  res.sendFile(__dirname + "/script/game.js");
});

app.get('/menu.js', (req, res) => {
  res.sendFile(__dirname + "/script/menu.js");
});

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + "/css/style.css");
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

// app.get('/lobby', (req, res) =>{
//   app.use(express.static(__dirname+"/css"));
//   app.use(express.static(__dirname+"/images"));
//   app.use(express.static(__dirname+"/script"));

//   res.sendFile(__dirname+"/html/pre_lobby.html");
// });



app.listen(process.env.PORT || 3000, function () {
});
