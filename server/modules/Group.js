const uuid = require('uuid/v4');
const socketSession = require('express-socket.io-session');

// Types for the ways the customer can split the bill.
const splitMethods = ['EVEN', 'CUSTOM']

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
    this.method = splitMethods[0];
    this.amount = 0;
    return this.id;
  }

  socketEvents() {
    const io = this.socket;
    io.on('connection', (socket) => {
      console.log('nsp someone connected');
      console.log('nsp Socket Session');
      console.log('nsp sessionID', socket.handshake.sessionID);
      io.emit('lead-status', this.isLeadMember(socket.handshake.sessionID));

      socket.on('admin-options', (opts) => {
        this.setSplitMethod(opts.method);
        this.setPaymentAmount(opts.amount);
        emitDetails();
      })

      socket.on('user-amount', (amount, tip) => {
        this.updateUserAmount(socket.handshake.sessionID, amount, tip);
        emitDetails();
      })

      const emitDetails = () => io.emit('group-details', this.toString());
      emitDetails();
    });
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
    array.unshift(this.leadMember.id);
    console.log(array);
    return array;
  }

  // Add other member to the group
  addOtherMember(user) {
    console.log('addOtherMember')
    console.log(user)
    if (!user.id || !user.name) throw new Error('Group.js/addOtherMember: User missing ID or Name');
    if (this.otherMembers.indexOf(user.id) >= 0) throw new Error('Group.js/addOtherMember: User aleady exists in array');
    this.otherMembers.push(user);
    this.socket.emit('member-added', this.toString());
    return this.otherMembers;
  }

  // Remove other member from the group
  removeOtherMember(user) {
    const index = this.otherMembers.indexOf(user);
    if (index < 0) throw new Error('Group.js/removeOtherMember: User not found in array');
    this.otherMembers.splice(index);
    this.socket.emit('member-removed', this.toString());
    return this.otherMembers;
  }

  // Returns new object without the whole socket that can be sent to the client
  // Remove private section from all users so that access tokens don't get send to client
  toString() {
    const removePrivate = ({...obj}) => {
      delete obj.private;
      return obj;
    }
    console.log('toString');
    const lead = removePrivate(this.leadMember);
    const otherMembers = [];
    for (let i = 0; i < this.otherMembers.length; i++) {
      const obj = this.otherMembers[i];
      otherMembers.push(removePrivate(obj));
    }
    return {
      id: this.id,
      endpoint: this.endpoint,
      leadMember: lead,
      otherMembers: otherMembers,
      socketNamespace: (this.socket.name) ? this.socket.name : null,
      method: this.method,
      amount: this.amount
    }
  }

  isLeadMember(id) {
    if (id === this.leadMember.id) return true;
    return false;
  }

  setSplitMethod(newMethod) {
    if (splitMethods.indexOf(newMethod) >= 0) {
      this.method = newMethod;
    } else {
      console.error('Group.js/setSplitMethod: invalid split method')
    }
  }

  setPaymentAmount(newAmount) {
    this.amount = newAmount;
  }

  updateUserAmount(userID, newAmount, newTip) {
    console.log('updateUserAmount', userID, newAmount, newTip);
    console.log(this.getLeadMember());

    console.log(this.getLeadMember());
  }
}

module.exports = Group;