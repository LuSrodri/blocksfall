const express = require('express');
const app = express();

app.get('/index', (req, res) =>{
  res.redirect('/');
});

app.get('/index.html', (req, res) =>{
  res.redirect('/');
});

app.get('', (req, res) =>{
  app.use(express.static(__dirname+"/css"));
  app.use(express.static(__dirname+"/images"));
  
  res.sendFile(__dirname+"/html/index.html");
});

app.get('/lobby', (req, res) =>{
  app.use(express.static(__dirname+"/css"));
  app.use(express.static(__dirname+"/images"));
  
  res.sendFile(__dirname+"/html/pre_lobby.html");
});

app.get('/play', (req, res) =>{
  app.use(express.static(__dirname+"/css"));
  app.use(express.static(__dirname+"/script"));
  
  
  res.sendFile(__dirname+"/html/play.html");
});

app.listen(3000, function() {
  });
