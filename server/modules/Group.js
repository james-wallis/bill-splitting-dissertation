const uuid = require('uuid/v4');

class Group {
  constructor(lead) {
    this.id = 'GROUP-' + uuid();
    this.leadMember = lead;
    this.otherMembers = [];
    return this.id;
  }

  getID() {
    return this.id;
  }

  getLeadMember() {
    return this.leadMember;
  }

  getOtherMembers() {
    return this.otherMembers;
  }

  
}

module.exports = Group;