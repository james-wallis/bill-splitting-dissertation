class Groups {
  constructor() {
    this.array = {};
  }

  add(group) {
    const id = group.getID();
    this.array[id] = group;
  }

  get(id) {
    return this.array[id];
  }

  delete(id) {
    delete this.array[id];
    return this.array;
  }

  // Check if a given user is in a group, if no then return false, if yes then return that group
  isUserInGroup(userID) {
    const array = this.array;
    for (const el in array) {
      const group = array[el];
      console.log('isUserInGroup, checkUserInGroup', group.checkUserInGroup(userID));
      if (group.checkUserInGroup(userID)) return group;
      // const members = group.getAllMembers();
      // console.log('isUserInGroup');
      // console.log(members);
      // for (let j = 0; j < members.length; j++) {
      //   const member = members[j];
      //   if (member === userID) return group;
      // }
    }
  }

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