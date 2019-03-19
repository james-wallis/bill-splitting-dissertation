const uuid = require('uuid/v4');
const socketSession = require('express-socket.io-session');

class Group {
  constructor(lead, socket, socketSession) {
    if (!lead) throw new Error('Group.js/constructor: New group must contain a lead member')
    if (!socket) throw new Error('Group.js/constructor: New group must pass in socket')
    if (!socketSession) throw new Error('Group.js/constructor: New group must pass in session function for socket')
    const id = uuid();
    this.id = 'GROUP-' + id;
    this.endpoint = '/' + id;
    this.leadMember = lead;
    this.otherMembers = [];
    this.socket = socket.of(this.endpoint).use(socketSession);
    this.socketEvents();
    return this.id;
  }

  socketEvents() {
    const io = this.socket;
    io.on('connection', function (socket) {
      console.log('nsp someone connected');
      console.log('nsp Socket Session');
      console.log('nsp sessionID', socket.handshake.sessionID);
    });
    io.emit('hi', 'everyone!');
  }

  getID() {
    return this.id;
  }

  getEndpoint() {
    return this.endpoint;
  }

  getLeadMember() {
    return this.leadMember;
  }

  getOtherMembers() {
    return this.otherMembers;
  }

  // Returns all members of a group
  // The lead member is at index position 0
  getAllMembers() {
    const array = [...this.otherMembers];
    array.unshift(this.leadMember);
    console.log(array);
    return array;
  }

  // Add other member to the group
  addOtherMember(user) {
    if (this.otherMembers.indexOf(user) >= 0) throw new Error('Group.js/addOtherMember: User aleady exists in array');
    this.otherMembers.push(user);
    return this.otherMembers;
  }

  // Remove other member from the group
  removeOtherMember(user) {
    const index = this.otherMembers.indexOf(user);
    if (index < 0) throw new Error('Group.js/removeOtherMember: User not found in array');
    this.otherMembers.splice(index);
    return this.otherMembers;
  }

  // Returns new object without the whole socket that can be sent to the client
  toString() {
    return {
      id: this.id,
      endpoint: this.endpoint,
      leadMember: this.leadMember,
      otherMembers: this.otherMembers,
      socketNamespace: (this.socket.name) ? this.socket.name : null
    }
  }

  
}

module.exports = Group;