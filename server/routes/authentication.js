const express = require('express');
const router = express.Router();
const fs = require('fs-extra')
const Starling = require('../modules/Starling.js');
const starling = new Starling();

router.get('/login', (req, res) => {
  starling.setRedirectUrl(req.protocol, req.get('host'));
  const url = starling.getOAuthUrl();
  res.redirect(url);
})

router.get('/auth/redirect', async (req, res) => {
  try {
    const data = await starling.getAccessToken(req.query.code);
    if (data.token_type === 'Bearer') {
      const tokens = {};
      tokens.access = data.access_token;
      tokens.refresh = data.refresh_token;
      tokens.expires = data.expires_in;
      const userData = await starling.getIdentity(data.access_token);
      const users = req.app.locals.users;
      if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'prod') {
        // If not production safe the access tokens to file for later use
        // Testing file save start
        const userCount = Object.keys(users.users).length;
        fs.writeJson(`./token-store/${userCount}.json`, tokens);
        // Testing file save end
      }
      users.add(req.session.id, data.access_token, userData);
    } else {
      throw new Error('Token is not of type Bearer.')
    }
    res.redirect('/')
  } catch (err) {
    console.error(err);
    res.code = 500;
    res.send('Error getting access token or creating user')
  }
})

router.all('*', async (req, res, next) => {
  try {
    const users = req.app.locals.users;
    const authenticated = await users.checkExists(req.session.id);
    if (!authenticated) {
      if (process.env.NODE_ENV && process.env.NODE_ENV === 'prod') return res.redirect('/login');
      // If not production then use the access token from development file.
      // Testing file save start
      const userCount = Object.keys(users.users).length;
      let newTokens = null;
      try {
        newTokens = await fs.readJson(`./token-store/${userCount}.json`, { throws: true });
      } catch (err) {
        return res.redirect('/login');
      }
      console.log('newTokens', newTokens);
      const tokens = {};
      if (newTokens) {
        tokens.access = newTokens.access;
        tokens.refresh = newTokens.refresh;
        tokens.expires = newTokens.expires;
      }
      const userData = await starling.getIdentity(newTokens.access);
      users.add(req.session.id, newTokens.access, userData);
    // Testing file save end
    }
    req.accessToken = await users.getStarlingAuthToken(req.session.id);
  }
  catch (err) {
    console.log('Authentication.js/*: Error in session middleware checking user is authenticated');
    console.error(err);
  }
  next();
})

router.post('/api/auth/logout', (req, res) => {
  const users = req.app.locals.users;
  users.delete(req.session.id);
  res.status(200).send('Logout successful');
})

module.exports = router;