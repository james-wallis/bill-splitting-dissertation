class Users {
  constructor() {
    this.users = {

    };
  }

  checkExists(id) {
    return (id in this.users);
  }

  add(uuid, accessToken) {
    this.users[uuid] = {
      starling: {
        accessToken: accessToken
      }
    }
  }

  getUser(uuid) {
    return this.users[uuid];
  }

  getStarlingAuthToken(uuid) {
    return this.users[uuid].starling.accessToken;
  }
}

module.exports = Users;