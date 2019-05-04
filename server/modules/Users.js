class Users {
  constructor() {
    this.users = {};
  }

  checkExists(id) {
    return (id in this.users);
  }

  add(uuid, accessToken, userData) {
    console.log('user added');
    console.log(userData);
    this.users[uuid] = {
      id: uuid,
      private: {
        starling: {
          accessToken: accessToken
        }
      },
      name: {
        first: userData.firstName,
        last: userData.lastName
      },
      payment: {
        amount: null,
        tip: null
      }
    }
  }

  getUser(uuid) {
    return this.users[uuid];
  }

  getPublicUser(uuid) {
    const user = { ...this.getUser(uuid)};
    // Remove the private key
    delete user.private;
    return user;
  }

  getStarlingAuthToken(uuid) {
    return this.users[uuid].private.starling.accessToken;
  }
}

module.exports = Users;