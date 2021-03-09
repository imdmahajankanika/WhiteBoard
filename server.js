const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.use('/canvas',express.static("public"))
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});
app.get('/index', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

 io.on('connection', (socket) => {
    socket.on('send figure', (msg) => {
      io.emit('share figure', msg);
    });
  });
http.listen(3000, () => {
  console.log('listening on *:3000');
});