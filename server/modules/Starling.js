const axios = require('axios');
const querystring = require('querystring');

const StarlingState = 'somerandomstring';

class Starling {
  constructor(redirectEndpoint) {
    this.ClientID = process.env.STARLING_CLIENT_ID;
    this.ClientSecret = process.env.STARLING_CLIENT_SECRET;
    this.ApiUrl = 'https://api-sandbox.starlingbank.com';
    this.OAuthUrl = 'https://oauth-sandbox.starlingbank.com';
    this.redirectEndpoint = redirectEndpoint;
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

  async getAPI(endpoint, accessToken) {
    const url = `${this.ApiUrl}${endpoint}`;
    const headers = { headers: { Authorization: `Bearer ${accessToken}` } };
    return await axios.get(url, headers);
  }

  async getIdentity(accessToken) {
    const response = await this.getAPI('/api/v2/identity/individual', accessToken);
    console.log(response.status);
    return response.data;
  }

  async getToken(accessToken) {
    const response = await this.getAPI('/api/v2/identity/token', accessToken);
    return response.data;
  }
}

module.exports = Starling;