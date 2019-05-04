class Users {
  constructor(uuid, accessToken, userData) {
    this.id = uuid
    this.private = {
      starling: {
        accessToken: accessToken
      }
    }
    this.name = {
      first: userData.firstName,
      last: userData.lastName
    }
    this.payment = {
      amount: null,
      tip: null
    }
  }

  getUser() {
    return this;
  }

  getPublicUser() {
    const user = { ...this };
    // Remove the private key
    delete user.private;
    return user;
  }

  getStarlingAuth() {
    return this.private.starling.accessToken;
  }

  setPayment(paymentObj) {
    console.log('paymentObj', paymentObj);
    if (paymentObj.amount > 0 && paymentObj.amount !== '') this.payment.amount = paymentObj.amount;
    if (paymentObj.tip >= 0 && paymentObj.tip !== '') this.payment.tip = paymentObj.tip;
  }
}

module.exports = Users;