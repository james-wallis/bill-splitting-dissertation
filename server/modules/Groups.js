/**
 * Class Groups
 * Holds an object containing all the Group objects for management
 */
class Groups {
  constructor() {
    this.array = {};
  }

  /**
   * Function add
   * Adds a new group to the Groups object
   * @param group
   */
  add(group) {
    const id = group.getID();
    this.array[id] = group;
  }

  /**
   * Function get
   * Returns a Group
   * @param id - The ID of the group to return 
   * @return a Group object
   */
  get(id) {
    return this.array[id];
  }

  /**
   * Function delete
   * Deletes a Group
   * @param id - The ID of the group to delete
   */
  delete(id) {
    delete this.array[id];
    return this.array;
  }

  /**
   * Function isUserInGroup
   * Checks whether a given user is currently in a Group
   * @param userID - The User ID to check
   * @returns group - The group that the user is a member of, if any.
   */
  isUserInGroup(userID) {
    const array = this.array;
    for (const el in array) {
      const group = array[el];
      if (group.checkUserInGroup(userID)) return group;
    }
  }

  /**
   * Function getGroupFromEndpoint
   * Returns the group matching the given endpoint
   * @param endpoint - The endpoint
   * @returns null if no group is found, the Group if found
   */
  getGroupFromEndpoint(endpoint) {
    const array = this.array;
    for (const el in array) {
      const group = array[el];
      if (group.getEndpoint() === `/${endpoint}`) return group;
    }
    return null;
  }
}

module.exports = Groups;