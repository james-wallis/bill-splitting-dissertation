const express = require('express');
const router = express.Router();
const session = require('express-session');
const uuid = require('uuid/v4');

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: true,
  saveUninitialized: true,
  genid: function () {
    return 'SESSION-' + uuid();
  },
}

if (router.get('env') === 'production') {
  router.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

router.use(session(sessionOptions))

module.exports = router;