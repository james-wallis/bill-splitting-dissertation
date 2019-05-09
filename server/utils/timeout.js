/**
 * Function used to slow down the operating time of a function using async/await
 * Used in the functioning application to slow the getTransaction function from requesting the Starling API too often
 * Used in the spoofed payment structure to enable the messages to be seen in the UI as they would if payment worked
 * @param ms - the number of milliseconds to pause the function for
 * @return Promise
 */
async function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = timeout;