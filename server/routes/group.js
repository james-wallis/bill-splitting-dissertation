const express = require('express');
const router = express.Router();
const Group = require('../modules/Group.js');
const Groups = require('../modules/Groups.js');
const groups = new Groups();

// Dummy
router.get('/', async (req, res) => {
  const user = req.session.id;
  // Check user isn't already in a different group
  const userInGroup = await groups.isUserInGroup(user);
  if (userInGroup) return res.status(500).send('User already exists in group ' + userInGroup.getID())
  console.log(req.app.locals);
  const group = new Group(user, req.app.locals.socket, req.app.locals.socketSession);
  res.send(group.getEndpoint())
  groups.add(group);
})

// Create a new group
router.post('/', async (req, res) => {
  const user = req.session.id;
  // Check user isn't already in a different group
  const userInGroup = await groups.isUserInGroup(user);
  if (userInGroup) return res.status(500).send('User already exists in group ' + userInGroup.getID())
  const group = new Group(user, req.app.locals.socket, req.app.locals.socketSession);
  res.send(group.getEndpoint())
  groups.add(group);
})

// Get a group
router.get('/:id', async (req,res) => {
  try {
    const id = req.params.id;
    const group = groups.getGroupFromEndpoint(id);
    console.log(group);
    if (group) return res.send(group.toString());
    return res.send('group not found --- ' + id)
  } catch (err) {
    console.error(err);
  }
})

// Add a member to a group
router.post('/:id', async (req, res) => {
  try {
    const user = req.session.id;
    const id = req.params.id;
    // Check user isn't already in a different group
    const userInGroup = await groups.isUserInGroup(user);
    if (userInGroup) return res.status(500).send('User already exists in group ' + userInGroup.getID());
    const group = groups.getGroupFromEndpoint(id);
    group.addOtherMember(user);
    const response = {
      group: group.toString()
    }
    if (group) return res.status(200).sendJSON(response);
    return res.status(404).send('group not found --- ' + id);
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
})

// Function to delete a member from a group
// If the lead member requests deletion from a group, the whole group is deleted
router.delete('/:id', async(req, res) => {
  const user = req.session.id;
  const id = req.params.id;
  const group = groups.getGroupFromEndpoint(id);
  if (group.getLeadMember() === user) {
    // User is the lead member of the group
    // Delete whole group
    groups.delete(group.getID());
    res.status(200).send('User was Lead member, group deleted successfully');
  } else if (group.getOtherMembers().indexOf(user) >= 0) {
    // User is an other member of the group
    // Remove user from group
    try {
      await group.removeOtherMember(user);
      return res.status(200).send('User removed successfully');
    } catch (err) {
      return res.status(500).send('Error removing user from group');
    }
  } else {
    // User not found in group
    // Send error back
    return res.status(404).send('User not found in group');
  }
})

module.exports = router;