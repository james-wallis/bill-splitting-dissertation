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

// Session
require('./routes/session')(app);

// Routes
app.use(require('./routes/authentication'));
app.use('/api/group', require('./routes/group'));
app.use('/api/starling', require('./routes/starling'));
app.use(require('./routes/ui'));

server.listen(process.env.PORT || 3001);

if(process.env.NODE_ENV && process.env.NODE_ENV === 'prod') {
  console.log('\nBill-splitting dissertation application');
  console.log('Open a browser at port:', (process.env.PORT || 3001));
}