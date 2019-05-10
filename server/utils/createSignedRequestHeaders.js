const crypto = require('crypto');
const fs = require('fs-extra')

/**
 * Function which returns a signed request header as per the Starling guidelines
 * Doesn't work for unknown reasons and won't run currently as private key has been removed from directory
 * This is the function that should be enhanced to enable Starling payment
 * @param method - The HTTP method being used
 * @param url - the URL used in the request
 * @param payload - the data being sent to the Starling API
 * @param accessToken - the access token for the user
 * @returns headers - The headers object as per the Starling documentation guidelines
 */
const createSignedRequestHeaders = async (method, url, payload, accessToken) => {
  if (!method) throw new Error('createSignedRequestHeaders.js: method not given.');
  if (!url) throw new Error('createSignedRequestHeaders.js: url not given.');
  if (!payload) throw new Error('createSignedRequestHeaders.js: payload not given.');
  if (!accessToken) throw new Error('createSignedRequestHeaders.js: accessToken not given.');
  const headers = {
    headers: {
      Authorization: null,
      Digest: null,
      Date: null
    }
  };
  const date = new Date();
  const dateString = date.toISOString();

  const digestInstance = crypto.createHash('sha512');
  digestInstance.update(JSON.stringify(payload))
  const digest = digestInstance.digest('base64');
  headers.headers.Digest = digest;

  let authorisationHeadersString = '';
  authorisationHeadersString += `(request-target): ${method} ${url} `;
  authorisationHeadersString += `Date: ${dateString} `
  authorisationHeadersString += `Digest: ${digest}`;

  // Pem file removed from project in order to not expose the file
  const pem = await fs.readFile(__dirname + '/starlingRSA.pem', 'utf8');
  const privateKey = pem.toString('ascii');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(authorisationHeadersString);
  sign.end();
  const signature = sign.sign(privateKey, 'base64');

  const keyUID = 'fa60d966-1bc5-47fd-9d7b-68f47c7cff90';

  let authorisationString = `Bearer ${accessToken};`;
  authorisationString += `Signature keyid="${keyUID}",`;
  authorisationString += `algorithm="rsa-sha256",`;
  authorisationString += `headers="${authorisationHeadersString}",`;
  authorisationString += `signature="${signature}"`

  headers.headers.Authorization = authorisationString;
  headers.headers.Date = dateString;
  return headers;
}

module.exports = createSignedRequestHeaders;