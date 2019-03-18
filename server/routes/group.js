const express = require('express');
const router = express.Router();
const Group = require('../modules/Group.js');
const Groups = require('../modules/Groups.js');
const groups = new Groups();

router.get('/', async (req, res) => {
  if (await groups.isUserInGroup(req.session.id)) return res.status(500).send('User already in group');
  const group = new Group(req.session.id)
  res.send('gotcah')
  groups.add(group);
  console.log(groups);
})

router.post('/', async (req, res) => {
  if (await groups.isUserInGroup(req.session.id)) return res.status(500).send('User already in group');
  const group = new Group(req.session.id)
  res.send('gotcah')
  groups.add(group);
  console.log(groups);
})

module.exports = router;