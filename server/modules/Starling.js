const axios = require('axios');
const querystring = require('querystring');
const uuid = require('uuid/v4');
const createSignedRequestHeaders = require('../utils/createSignedRequestHeaders');
const timeout = require('../utils/timeout');

const StarlingState = 'somerandomstring';

class Starling {
  constructor() {
    this.ClientID = process.env.STARLING_CLIENT_ID;
    this.ClientSecret = process.env.STARLING_CLIENT_SECRET;
    this.ApiUrl = 'https://api-sandbox.starlingbank.com';
    this.OAuthUrl = 'https://oauth-sandbox.starlingbank.com';
    this.redirectEndpoint = 'auth/redirect';
  }

  setRedirectUrl(protocol, domain) {
    this.redirectUrl = `${protocol}://${domain}/${this.redirectEndpoint}`;
  }

  getRedirectUrl() {
    return this.redirectUrl;
  }

  getOAuthUrl() {
    const query = querystring.stringify({
      client_id: this.ClientID,
      response_type: 'code',
      state: StarlingState,
      redirect_uri: this.redirectUrl
    })
    return `${this.OAuthUrl}/?${query}`;
  }

  async getAccessToken(code) {
    const url = `${this.ApiUrl}/oauth/access-token`
    const response = await axios.post(url,
      querystring.stringify({
        code: code,
        client_id: this.ClientID,
        client_secret: this.ClientSecret,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUrl
      }));
    return response.data;
  }

  async getAPI(endpoint, accessToken, query = null) {
    if (!endpoint) throw new Error('Starling.js/getAPI: Endpoint not supplied.');
    if (!accessToken) throw new Error('Starling.js/getAPI: Access Token not supplied.');
    const url = `${this.ApiUrl}${endpoint}`;
    const options = { headers: { Authorization: `Bearer ${accessToken}` } };
    if (query) options.params = query;
    return await axios.get(url, options);
  }

  async getIdentity(accessToken) {
    const response = await this.getAPI('/api/v2/identity/individual', accessToken);
    return response.data;
  }

  // async getToken(accessToken) {
  //   const response = await this.getAPI('/api/v2/identity/token', accessToken);
  //   return response.data;
  // }

  async getAccounts(accessToken) {
    const accountsResponse = await this.getAPI('/api/v2/accounts', accessToken);
    if (!accountsResponse.data.accounts) throw new Error('Accounts not received.');
    const accounts = accountsResponse.data.accounts;
    let list = [];
    for (let index = 0; index < accounts.length; index++) {
      const id = accounts[index].accountUid;
      const defaultCategory = accounts[index].defaultCategory;
      const response = await this.getAPI(`/api/v2/accounts/${id}/identifiers`, accessToken);
      const acc = response.data;
      acc.id = id;
      acc.defaultCategory = defaultCategory;
      list.push(acc); 
    }
    return list;
  }

  async getBalance(accessToken, accountID = null) {
    if(!accountID) throw new Error('Starling.js/getBalance: Account not given.');
    const response = await this.getAPI(`/api/v2/accounts/${accountID}/balance`, accessToken);
    return response.data;
  }

  async getAvailableFunds(accessToken, accountID = null) {
    if (!accountID) throw new Error('Starling.js/getAvailableFunds: Account not given.');
    const balance = await this.getBalance(accessToken, accountID);
    // Convert available to spend to put the decimal place in and return
    return balance.availableToSpend.minorUnits / 100;
  }

  async getTransactions(accountID, categoryID, date, accessToken) {
    if (!accountID) throw new Error('Starling.js/findTransaction: Account not given.');
    if (!categoryID) throw new Error('Starling.js/findTransaction: categoryID not given.');
    if (!date) throw new Error('Starling.js/findTransaction: date not given.');
    if (!accessToken) throw new Error('Starling.js/findTransaction: accessToken not given.');
    const query = {
      changesSince: date
    }
    const response = await this.getAPI(`/api/v2/feed/account/${accountID}/category/${categoryID}`, accessToken, query);
    return response.data;
  }

  /**
   * Function makeFakePayment
   * Spoof version of the makePayment function below
   * It is with regret that the feature of using the Starling API to make payments wasn't able to be fulfilled.
   * 
   * Discussed in the dissertation document itself is the fact that 
   * I couldn't get the Starling API to make a payment to another user.
   * This is due to not being able to work out what the correct headers were required to make a signed request.
   * The only documentation given on the Starling API developers website is what is required and then a Java implementation.
   * Find in server/utils/createSignedRequestHeaders.js the code used to create what I believe should be the correct headers
   * when the private key of the public key given to Starling is used.
   * The response code is always "{"error":"signature_check_failed","error_description":"request signed incorrectly"}"
   * so there is no way to understand what is wrong without guess work hence the payment feature has
   * failed to be implemented and a fake payment function added to demonstrate the application.
   * 
   * This fakePayment takes the same parameters needed for the makePayment function
   * 
   * It would be beneficial to revisit this application at a later date when the Starling docs are more descriptive on what 
   * the "message signing" (as the call it) requires to get it working or a successful JavaScript implementation made.
   * 
   * Function makeFakePayment
   * @params accessToken - the access token for the user
   * @params accountID - the accountID to use
   * @params category - the category to use for the payment
   * @params accountToPay - an object with details of the account is to be paid (account number etc)
   * @params amountToPay - the amount to pay the account
   * @returns Object - an object containing a spoofed payment ID
   */
  async makeFakePayment(accessToken, accountID = null, category = null, accountToPay = null, amountToPay = null) {
    if (!accessToken) throw new Error('Starling.js/makeFakePayment: accessToken not given.');
    if (!accountID) throw new Error('Starling.js/makeFakePayment: Account not given.');
    if (!category) throw new Error('Starling.js/makeFakePayment: Category not given.');
    if (!accountToPay) throw new Error('Starling.js/makeFakePayment: AccountToPay not given.');
    if (!amountToPay) throw new Error('Starling.js/makeFakePayment: amountToPay not given.');
    // Slow down the fake payment function to spoof a HTTP response time
    await timeout(500);
    return {
      paymentOrderUid: uuid()
    }
  }

  /**
   * Function makePayment
   * Doesn't work, see the makeFakePayment function above.
   * @params accessToken - the access token for the user
   * @params accountID - the accountID to use
   * @params category - the category to use for the payment
   * @params accountToPay - an object with details of the account is to be paid (account number etc)
   * @params amountToPay - the amount to pay the account
   * @returns response.data - an object containing the payment ID
   */
  async makePayment(accessToken, accountID = null, category = null, accountToPay = null, amountToPay = null) {
    if (!accessToken) throw new Error('Starling.js/makeFakePayment: accessToken not given.');
    if (!accountID) throw new Error('Starling.js/makePayment: Account not given.');
    if (!category) throw new Error('Starling.js/makePayment: Category not given.');
    if (!accountToPay) throw new Error('Starling.js/makePayment: AccountToPay not given.');
    if (!amountToPay) throw new Error('Starling.js/makePayment: amountToPay not given.');
    const url = `/api/v2/payments/local/account/${accountID}/category/${category}`;
    const body = {};
    body.reference = 'dissoapp';
    // Currency is always set to GBP as this app is for GBP only, future work is required to support other currencies
    body.amount = {
      currency: 'GBP',
      minorUnits: convertToMinorUnits(amountToPay)
    }
    if (accountToPay && typeof accountToPay === 'object' && accountToPay.constructor === Object) {
      // Account to pay is not a Starling customer
      body.paymentRecipient = {
        payeeName: 'The Merchant',
        payeeType: 'BUSINESS',
        countryCode: 'GB',
        accountIdentifier: accountToPay.accountNumber,
        bankIdentifier: accountToPay.sortCode,
        bankIdentifierType: 'SORT_CODE'
      }
    } else {
      body.destinationPayeeAccountUid = accountToPay;
    }
    const headers = await createSignedRequestHeaders('put', url, body, accessToken);
    headers.headers['Content-Type'] = 'application/json';
    headers.headers['Accept'] = 'application/json';

    const response = await axios.put(`${this.ApiUrl}${url}`, JSON.stringify(body), headers);
    return response.data;
  }
}

/**
 * Function convertToMinorUnits
 * @params num - the number to convert to minor units. 
 * @returns the number as an Integer
 */
const convertToMinorUnits = (num) => {
  const dp = parseFloat(Math.round(num * 100) / 100).toFixed(2);
  num = dp.replace('.', '');
  return parseInt(num);
}



module.exports = Starling;