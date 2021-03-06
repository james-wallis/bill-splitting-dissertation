const expressSession = require('express-session');
const socketSession = require('express-socket.io-session');
const uuid = require('uuid/v4');

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: true,
  saveUninitialized: true,
  genid: function () {
    return 'USER-' + uuid();
  },
}

const session = expressSession(sessionOptions);

module.exports = function(app) {
  app.use(session);

  app.locals.socketSession = socketSession(session, {
    autoSave: true
  });

  app.locals.socket.use(app.locals.socketSession);
}