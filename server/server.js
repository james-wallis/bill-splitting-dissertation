require('dotenv').config();
const express = require('express');
const path = require('path');
const Starling = require('./modules/Starling.js');
const fs = require('fs-extra');

const starlingRedirectEndpoint = 'starling/redirect';
const starling = new Starling(starlingRedirectEndpoint);

const tokens = {
  access: null,
  refresh: null,
  expires: null
}

const app = express();
app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('*', async (req, res, next) => {
  try {
    const newTokens = await fs.readJson('./token-store.json', { throws: false });
    if (newTokens) {
      tokens.access = newTokens.access;
      tokens.refresh = newTokens.refresh;
      tokens.expires = newTokens.expires;
    }
  }
  catch(err) {
    console.log(err);
  }
  next();
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
})

app.get('/starling', (req, res) => {
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
    } else {
      throw new Error('Token is not of type Bearer.')
    }
    res.redirect('/')
  } catch(err) {
    console.error(err);
    res.code = 500;
    res.send('Error getting access token')
  }
})

app.get('/api/starling/info', async (req, res) => {
  try {
    const data = await starling.getIdentity(tokens.access);
    res.send(data);
  } catch(err) {
    console.error(err);
    res.code = 500;
    res.send('Error getting user info')
  }
})

app.get('/api/starling/balance', (req, res) => {
  res.send('not implemented');
})

app.listen(process.env.PORT || 3001);