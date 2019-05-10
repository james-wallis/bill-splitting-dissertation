const Starling = require('./Starling.js');
const starling = new Starling();

/**
 * Class User
 * The User object which holds information in each individual user
 */
class User {
  constructor(uuid, accessToken, userData) {
    this.id = uuid // User ID
    this._private = { // Values that shouldn't be sent to the client
      starling: {
        accessToken: accessToken, // Starling access token
        account: {}, // Details about the users account such as account number
      }
    }
    this.name = {
      first: userData.firstName, // First name from Starling account
      last: userData.lastName // Surname from Starling account
    }
    this.payment = {
      amount: 0, // Amount they will pay towards the bill-splitting payment
      tip: 0, // Amount they wish to tip
      status: false, // Whether they have accepted their amounts and are ready to pay
      available: 0, // How much money they have available in their Starling account
      canAffordPayment: false // Whether they have enough money to afford the payment
    }
    this.setAccount();
    this.setAvailableFunds();
  }

  getUser() {
    return this;
  }

  getPublicUser() {
    const user = { ...this };
    // Remove the private key
    delete user._private;
    return user;
  }

  getStarlingAuth() {
    return this._private.starling.accessToken;
  }

  setPaymentAmount(paymentObj) {
    if (paymentObj.amount > 0 && paymentObj.amount !== '') this.payment.amount = convertToMoney(paymentObj.amount);
    if (paymentObj.tip >= 0 && paymentObj.tip !== '') this.payment.tip = convertToMoney(paymentObj.tip);
    this.setCanAffordPayment();
  }

  getPaymentAmount() {
    return this.payment.amount;
  }

  setPaymentStatus(status) {
    this.payment.status = status;
  }

  getTotalPaymentAmount() {
    return this.payment.amount + this.payment.tip;
  }

  setCanAffordPayment() {
    this.payment.canAffordPayment = (this.payment.available >= this.getTotalPaymentAmount()) ? true : false;
  }

  async setAccount() {
    try {
      const accounts = await starling.getAccounts(this.getStarlingAuth());
      // Take the first account in the accounts array as the application doesn't support multiple accounts.
      this._private.starling.account = accounts[0];
    } catch (err) {
      console.log('setAccount error, User.js');
      console.error(err);
    }
  }

  async getAccount() {
    return this._private.starling.account;
  }

  // Set the available funds for the user
  // Use the first account in the account list as there is no functionality to choose the account 
  async setAvailableFunds() {
    try {
      const accounts = await starling.getAccounts(this.getStarlingAuth());
      const availableFunds = await starling.getAvailableFunds(this.getStarlingAuth(), accounts[0].id);
      this.payment.available = availableFunds;
      this.setCanAffordPayment();
    } catch (err) {
      console.log('setAvailableFunds error, User.js');
      console.error(err);
    }
  }

  async makePayment(accountToPay, amountToPay) {
    try {
      if (!accountToPay) throw new Error('makePayment/User.js, Account not given.');
      if (!amountToPay) throw new Error('makePayment/User.js, Amount to pay not given.');
      const accountID = this._private.starling.account.id;
      const category = this._private.starling.account.defaultCategory;
      // See Starling.js function makeFakePayment for explanation.
      // return await starling.makePayment(this.getStarlingAuth(), accountID, category, accountToPay, amountToPay);
      const data = await starling.makeFakePayment(this.getStarlingAuth(), accountID, category, accountToPay, amountToPay);
      return data.paymentOrderUid;
    } catch (err) {
      console.log('makePayment error, User.js');
      console.error(err);
    }
  }

  async makePaymentToLeadMember(accountToPay) {
    try {
      if (!accountToPay) throw new Error('makePaymentToLeadMember/User.js, Account not given.');
      return await this.makePayment(accountToPay, this.getTotalPaymentAmount());
    } catch (err) {
      console.log('makePaymentToLeadMember, User.js');
      console.error(err);
    }
  }

  async makePaymentToMerchant(accountToPay, totalGroupAmount) {
    try {
      if (!accountToPay) throw new Error('makePaymentToLeadMember/User.js, Account not given.');
      return await this.makePayment(accountToPay, totalGroupAmount);
    } catch (err) {
      console.log('makePaymentToMerchant, User.js');
      console.error(err);
    }
  }

  async getTransactions(date) {
    const transactions = await starling.getTransactions(this._private.starling.account.id, 
      this._private.starling.account.defaultCategory, 
      date, 
      this._private.starling.accessToken);
    return transactions;
  }

  resetUserPayment() {
    this.payment = {
      amount: 0,
      tip: 0,
      status: false,
      available: 0,
      canAffordPayment: false
    }
  }
}

// A function to convert a String into the form X.X where the second X is at most two characters 
const convertToMoney = num => { return parseFloat(parseFloat(Math.round(num * 100) / 100).toFixed(2))};

module.exports = User;