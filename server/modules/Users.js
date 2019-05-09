const User = require('./User.js');

class Users {
  constructor() {
    this.users = {};
  }

  checkExists(id) {
    return (id in this.users);
  }

  add(uuid, accessToken, userData) {
    this.users[uuid] = new User(uuid, accessToken, userData);
  }

  getUser(uuid) {
    return this.users[uuid].getUser();
  }

  getPublicUser(uuid) {
    return this.users[uuid].getPublicUser();
  }

  getStarlingAuthToken(uuid) {
    return this.users[uuid].getStarlingAuth();
  }
}

module.exports = Users;