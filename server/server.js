require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);

// Local Modules
const Users = require('./modules/Users.js');

app.locals.users = new Users();
app.locals.socket = require('socket.io')(server);
app.locals.tokens = {
  access: null,
  refresh: null,
  expires: null
}

app.locals.socket.on('connection', function (socket) {
  console.log('someone connected');
  console.log('Socket Session');
  console.log('sessionID', socket.handshake.sessionID);
});

// Session
require('./routes/session')(app);

// Routes
app.use(require('./routes/authentication'));
app.use('/api/group', require('./routes/group'));
app.use('/api/starling', require('./routes/starling'));
app.use(require('./routes/ui'));

server.listen(process.env.PORT || 3001);