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

  isUserInGroup(userID) {
    const array = this.array;
    for (const el in array) {
      const group = array[el];
      const lead = group.getLeadMember();
      if (lead === userID) return true;
      // Uncomment when other members are implemented
      // const otherMembers = group.getOtherMembers();
      // if (otherMembers || otherMembers.length > 0) {
      //   for (let j = 0; j < otherMembers.length; j++) {
      //     const member = otherMembers[j];

      //   }
      // }
    }
  }  


}

module.exports = Groups;