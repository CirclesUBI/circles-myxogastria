import core from '~/services/core';
import web3 from '~/services/web3';

/**
 * Finds the maximum transferable amount by transitive transfers between two safe addresses
 * @param {string} from Address from which transfer is to be sent
 * @param {string} to Address to receive transfer
 * @param {function} setMaxFlow function to set max flow state variable
 * @returns nothing. Updates MaxFlow state in Freckles.
 */
export async function findMaxFlow(from, to, setMaxFlow) {
  // First attempt, try via API
  try {
    const response = await core.token.findTransitiveTransfer(
      from,
      to,
      new web3.utils.BN(web3.utils.toWei('1000000000000000', 'ether')), // Has to be a large amount
    );

    // Throw an error when no path was found, we should try again with
    // checking direct sends as the API might not be in sync yet
    if (response.maxFlowValue === '0') {
      throw new Error('Zero value found when asking API');
    }

    setMaxFlow(response.maxFlowValue);
    return;
  } catch {
    setMaxFlow('0');
  }

  // Second attempt, do contract call
  try {
    const sendLimit = await core.token.checkSendLimit(from, to);
    setMaxFlow(sendLimit);
  } catch (error) {
    setMaxFlow('0');
  }
}
