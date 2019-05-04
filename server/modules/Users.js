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
    // this.users[uuid] = {
    //   id: uuid,
    //   private: {
    //     starling: {
    //       accessToken: accessToken
    //     }
    //   },
    //   name: {
    //     first: userData.firstName,
    //     last: userData.lastName
    //   },
    //   payment: {
    //     amount: null,
    //     tip: null
    //   }
    // }
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