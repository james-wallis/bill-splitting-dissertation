const express = require('express');
const router = express.Router();
const Starling = require('../modules/Starling.js');
const starling = new Starling();

router.get('/info', async (req, res) => {
  try {
    const data = await starling.getIdentity(req.accessToken);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.code = 500;
    res.send('Error getting user info')
  }
})

// router.get('/token', async (req, res) => {
//   try {
//     const data = await starling.getToken(req.accessToken);
//     res.send(data);
//   } catch (err) {
//     console.error(err);
//     res.code = 500;
//     res.send('Error getting token info')
//   }
// })

// router.get('/accounts', async (req, res) => {
//   try {
//     const data = await starling.getAccounts(req.accessToken);
//     res.send(data);
//   } catch (err) {
//     console.error(err);
//     res.code = 500;
//     res.send('Error getting token info')
//   }
// })

module.exports = router;