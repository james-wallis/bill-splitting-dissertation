require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const fs = require('fs-extra');
const session = require('express-session');
const uuid = require('uuid/v4');

const Starling = require('./modules/Starling.js');
const Users = require('./modules/Users.js');

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false,
  genid: function (req) {
    return uuid()
  },
}
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

app.use(session(sessionOptions))

const starlingRedirectEndpoint = 'starling/redirect';
const starling = new Starling(starlingRedirectEndpoint);
const users = new Users();

const tokens = {
  access: null,
  refresh: null,
  expires: null
}

app.get('/login', (req, res) => {
  starling.setRedirectUrl(req.protocol, req.get('host'));
  const url = starling.getOAuthUrl();
  res.redirect(url);
})

app.get(`/${starlingRedirectEndpoint}`, async (req, res) => {
  // if (!req.query.code) return res.redirect('/');
  try {
    const data = await starling.getAccessToken(req.query.code);
    if (data.token_type === 'Bearer') {
      tokens.access = data.access_token;
      tokens.refresh = data.refresh_token;
      tokens.expires = data.expires_in;
      fs.writeJson('./token-store.json', tokens);
      users.add(req.session.id, data.access_token);
      console.log(users.users);
    } else {
      throw new Error('Token is not of type Bearer.')
    }
    res.redirect('/')
  } catch (err) {
    console.error(err);
    res.code = 500;
    res.send('Error getting access token')
  }
})

app.get('*', async (req, res, next) => {
  const authenticated = await users.checkExists(req.session.id);
  console.log(authenticated);
  if (!authenticated) return res.redirect('/login');
  req.accessToken = await users.getStarlingAuthToken(req.session.id);

  try {
    const newTokens = await fs.readJson('./token-store.json', { throws: false });
    if (newTokens) {
      tokens.access = newTokens.access;
      tokens.refresh = newTokens.refresh;
      tokens.expires = newTokens.expires;
    }
    console.log(req.session.id);
    console.log(users.users)
  }
  catch(err) {
    console.log(err);
  }
  next();
})

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
})

app.get('/api/starling/info', async (req, res) => {
  try {
    const data = await starling.getIdentity(req.accessToken);
    res.send(data);
  } catch(err) {
    console.error(err);
    res.code = 500;
    res.send('Error getting user info')
  }
})

app.get('/api/starling/token', async (req, res) => {
  try {
    const data = await starling.getToken(req.accessToken);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.code = 500;
    res.send('Error getting token info')
  }
})

app.get('/api/starling/balance', (req, res) => {
  res.send('not implemented');
})


server.listen(process.env.PORT || 3001);