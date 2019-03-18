require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');

// Local Modules
const Users = require('./modules/Users.js');

app.locals.users = new Users();
app.locals.tokens = {
  access: null,
  refresh: null,
  expires: null
}

// Routes
app.use(require('./routes/session'))
app.use(require('./routes/authentication'));
app.use('/api/group', require('./routes/group'));
app.use('/api/starling', require('./routes/starling'));

app.use(express.static(path.join(__dirname, '..', 'build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
})

server.listen(process.env.PORT || 3001);