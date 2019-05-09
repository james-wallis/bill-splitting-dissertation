const uuid = require('uuid/v4');
// const socketSession = require('express-socket.io-session');
const timeout = require('../utils/timeout');

// Types for the ways the customer can split the bill.
const splitMethods = ['CUSTOM', 'EVEN']

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
    this.amount = '';
    this.merchant = { // The merchant should be selected by the application but as this is a proof of concept
      accountNumber: '46078856', // the merchant is set to another member of the Starling sandbox.
      sortCode: '608371',
    }
    return this.id;
  }

  socketEvents() {
    const io = this.socket;
    io.on('connection', (socket) => {
      console.log('New user connected to Group', this.id);
      socket.emit('lead-status', this.isLeadMember(socket.handshake.sessionID));

      socket.on('admin-options', (opts) => {
        this.setSplitMethod(opts.method);
        this.setPaymentAmount(opts.amount);
        emitGroupDetails();
      })

      socket.on('user-amount', async (amount, tip) => {
        await this.updateUserAmount(socket.handshake.sessionID, amount, tip);
        emitDetails();
      })

      socket.on('commit-to-payment', status => {
        this.updateUserStatus(socket.handshake.sessionID, status);
        io.emit('change-payment-ready-status', this.getPaymentReadyStatus());
        emitDetails();
      })

      socket.on('initiate-payment', () => {
        io.emit('payment-initiated', true);
        this.initiatePayment();
      })

      const emitUserDetails = () => {
        const userID = socket.handshake.sessionID;
        const user = (this.isLeadMember(userID)) ? this.getLeadMember() : this.getOtherMember(userID);
        socket.emit('user-details', user.getPublicUser());
      }
      const emitGroupDetails = () => io.emit('group-details', this.toString());
      const emitDetails = () => {
        emitGroupDetails();
        emitUserDetails();
      }
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

  getOtherMemberIndex(id) {
    const array = [...this.otherMembers];
    for (let i = 0; i < array.length; i++) {
      const member = array[i];
      if (member.id === id) return i;
    }
    return null;
  }

  getOtherMember(id) {
    const i = this.getOtherMemberIndex(id);
    return this.otherMembers[i];
  }

  checkUserInGroup(id) {
    if (this.getLeadMember().id === id) return true;
    const i = this.getOtherMemberIndex(id);
    return (i !== null && i > -1) ? true : false;
  }

  // Returns all members of a group
  // The lead member is at index position 0
  getAllMembers() {
    const array = [...this.otherMembers];
    array.unshift(this.leadMember);
    return array;
  }

  // Add other member to the group
  addOtherMember(user) {
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
    const lead = this.leadMember.getPublicUser();
    const otherMembers = [];
    for (let i = 0; i < this.otherMembers.length; i++) {
      otherMembers.push(this.otherMembers[i].getPublicUser());
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
    const user = (this.isLeadMember(userID)) ? this.getLeadMember() : this.getOtherMember(userID);
    user.setPaymentAmount({ 
      amount: newAmount,
      tip: newTip
    });
  }

  updateUserStatus(userID, status) {
    const user = (this.isLeadMember(userID)) ? this.getLeadMember() : this.getOtherMember(userID);
    user.setPaymentStatus(status);
  }

  // Iterates over all users and returns true if all have committed to making the payment
  getPaymentReadyStatus() {
    const mem = this.getAllMembers();
    for (let i = 0; i < mem.length; i++) {
      const user = mem[i];
      if (!user.payment.status) return false;
    }
    return true;
  }

  getTotalAmountPledged() {
    const mem = this.getAllMembers();
    let totalAmount = 0;
    for (let i = 0; i < mem.length; i++) {
      const user = mem[i];
      totalAmount += user.getPaymentAmount();
    }
    return totalAmount;
  }

  async initiatePayment() {
    try {
      this.socket.emit('payment-status', 'initated');
      if (!this.amount) return this.socket.emit('payment-status', 'error', 'no amount');
      if (this.amount > await this.getTotalAmountPledged()) return this.socket.emit('payment-status', 'error', 'not enough');
      const lead = this.getLeadMember();
      // Set now as the time for the payments to have been sent as the earliest time to get transactions for
      const transactionTime = new Date();
      // Tell all users to pay the lead member
      const paymentIDs = await otherMembersPayLead(lead, this.otherMembers);
      // Inform UI that the "otherMembers" have sent money to the lead user
      this.socket.emit('payment-status', 'lead-money-sent');
      await verifyPaymentsReceived(lead, paymentIDs, transactionTime);
      this.socket.emit('payment-status', 'lead-money-received');
      await lead.makePaymentToMerchant(this.merchant, this.amount);
      this.socket.emit('payment-status', 'merchant-money-sent');
    } catch(err) {
      console.log('Error Group.js/initiatePayment');
      console.error(err);
      this.socket.emit('payment-status', 'error', err);
    }
  }
}

async function otherMembersPayLead(lead, otherMembers) {
  const paymentIDs = [];
  for (let i = 0; i < otherMembers.length; i++) {
    const member = otherMembers[i];
    // If user has said they are ready to pay but not set an amount skip them
    // If something has gone wrong then there will not be enough money to pay the bill so this wouldn't be reached
    if (member.getTotalPaymentAmount() > 0) {
      const paymentID = await member.makePaymentToLeadMember(lead.getAccount());
      member.setPaymentID = paymentID;
      paymentIDs.push(paymentID);
    }
  }
  return paymentIDs;
}

/**
 * Function to check the lead members account to verify that they have received the payment from all users
 * This function is another that cannot be tested to its full extent due to the payment 
 * limitation described server/modules/Starling.js makeFakePayment
 * Due to the limitation the function always returns True.
 * @param lead - The lead member object
 * @param idList - The list of payment IDs
 * @param transactionTime - This time that the transaction was made
 * @returns True if all the payments are found in 30 seconds, False if not
 */
async function verifyPaymentsReceived(lead, idList, transactionTime) {
  // pause this function for 3 seconds to demo UI messages
  await timeout(3000);
  return true;
  // // Loop around all other users and have the lead member verify that the payment has been found
  // let timeTaken = 0;
  // let paymentsVerified = 0;
  // while (paymentsVerified < idList.length || timeTaken < 30) {
  //   const transactions = await lead.getTransactions(transactionTime.toISOString());
  //   for (let i = 0; i < transactions.feedItems.length; i++) {
  //     const t = transactions.feedItems[i];
  //     // If the transaction is found then add one payment verfied to the counter.
  //   }
  //   // Wait two seconds before calling the Starling API again to stop request limiting
  //   await timeout(2000);
  //   timeTaken++;
  // }
  // // Returns true if all payments are found in the given time
  // return (paymentsVerified < idList.length && timeTaken < 30)
}

module.exports = Group;