const express = require('express');
const router = express.Router();
const Group = require('../modules/Group.js');
const Groups = require('../modules/Groups.js');
const groups = new Groups();

// Return if user is in a group and the groups endpoint
router.get('/', async (req, res) => {
  const userID = req.session.id;
  const group = await groups.isUserInGroup(userID);
  if (group) {
    return res.status(200).json(group.toString());
  } else {
    return res.status(200).send(null)
  }
})

// Create a new group
router.post('/', async (req, res) => {
  const userID = req.session.id;
  // Check user isn't already in a different group
  const userInGroup = await groups.isUserInGroup(userID);
  if (userInGroup) return res.status(500).send('User already exists in group ' + userInGroup.getID())
  const user = req.app.locals.users.getUser(userID);
  const group = new Group(user, req.app.locals.socket, req.app.locals.socketSession);
  res.send(group.getEndpoint())
  groups.add(group);
})

// Get a group
router.get('/:id', async (req,res) => {
  try {
    const id = req.params.id;
    const group = groups.getGroupFromEndpoint(id);
    if (group) return res.status(200).send(group.toString());
    return res.status(404).send('group not found --- ' + id)
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
})

// Add a member to a group
router.post('/:id', async (req, res) => {
  try {
    const userID = req.session.id;
    const id = req.params.id;
    const users = req.app.locals.users;
    // Check user isn't already in a different group
    const userInGroup = await groups.isUserInGroup(userID);
    if (userInGroup) return res.status(409).json({
      error: {
        message: 'user exists in group',
      },
      group: userInGroup.toString()
    });
    const group = groups.getGroupFromEndpoint(id);
    const user = users.getUser(userID);
    group.addOtherMember(user);
    if (group) return res.status(200).json({
      group: group.toString()
    });
    return res.status(404).json({
      error: {
        message: 'group not found'
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: {
        message: err.message
      }
    });
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