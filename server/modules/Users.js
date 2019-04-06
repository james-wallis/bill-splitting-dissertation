class Users {
  constructor() {
    this.users = {};
  }

  checkExists(id) {
    return (id in this.users);
  }

  add(uuid, accessToken, userData) {
    console.log(userData);
    this.users[uuid] = {
      starling: {
        accessToken: accessToken
      },
      name: {
        first: userData.firstName,
        last: userData.lastName
      }
    }
  }

  getUser(uuid) {
    return this.users[uuid];
  }

  getPublicUser(uuid) {
    const u = this.getUser(uuid);
    return {
      id: uuid,
      name: u.name
    }
  }

  getStarlingAuthToken(uuid) {
    return this.users[uuid].starling.accessToken;
  }
}

module.exports = Users;