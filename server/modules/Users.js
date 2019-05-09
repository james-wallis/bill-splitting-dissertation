const User = require('./User.js');

/**
 * Class Users
 * The Users which contains all the users registered with the application
 */
class Users {
  constructor() {
    this.users = {};
  }

  /**
   * Function checkExists
   * @param id - The ID of the user to check exists
   * @returns - True if the user already exists 
   */
  checkExists(id) {
    return (id in this.users);
  }

  /**
   * Function add
   * Creates a new user and adds it to the Users object
   * @param uuid - The ID for the new user
   * @param accessToken - The access token for the new user
   * @param userData - Data about the user such as name
   */
  add(uuid, accessToken, userData) {
    this.users[uuid] = new User(uuid, accessToken, userData);
  }

  /**
   * Function to delete a user
   * @param uuid - the ID of the user to delete
   */
  delete(uuid) {
    delete this.users[uuid];
  }

  /**
   * Function getUser
   * @param uuid - The ID of the user to return
   * @returns the requested user
   */
  getUser(uuid) {
    return this.users[uuid].getUser();
  }

  /**
   * Function getPublicUser
   * Returns the public version of a user meaning it has the _private field taken out 
   * so that their access token and account details are not transmitted into the public domain
   * @param uuid - the ID of the user
   * @returns the public version of a user object
   */
  getPublicUser(uuid) {
    return this.users[uuid].getPublicUser();
  }

  /**
   * Function getStarlingAuthToken
   * Returns the Starling authentication token for a user
   * @param uuid - the user id to get the token for
   * @returns the Starling access token
   */
  getStarlingAuthToken(uuid) {
    return this.users[uuid].getStarlingAuth();
  }
}

module.exports = Users;