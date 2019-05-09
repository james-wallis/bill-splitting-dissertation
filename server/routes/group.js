const express = require('express');
const router = express.Router();
const Group = require('../modules/Group.js');
const Groups = require('../modules/Groups.js');
const groups = new Groups();

/**
 * Function to delete a group when it is completed
 * This function is passed into a group when it is created so that it can be deleted entirely
 * @param id - The ID of the group to delete
 */
const deleteGroup = (id) => {
  groups.delete(id);
}

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
  const group = new Group(user, req.app.locals.socket, req.app.locals.socketSession, deleteGroup);
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
router.delete('/', async(req, res) => {
  const userID = req.session.id;
  const group = await groups.isUserInGroup(userID);
  if (!group) return res.sendStatus(200); 
  if (group.getLeadMember().id === userID) {
    // User is the lead member of the group
    // Delete whole group
    group.closeGroup();
    res.status(200).send('User was Lead member, group deleted successfully');
  } else {
    // User is an other member of the group
    // Remove user from group
    try {
      await group.removeOtherMember(userID);
      return res.status(200).send('User removed successfully');
    } catch (err) {
      return res.status(500).send('Error removing user from group');
    }
  }
})

module.exports = router;