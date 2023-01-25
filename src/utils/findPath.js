import core from '~/services/core';
import web3 from '~/services/web3';
import { PATHFINDER_HOPS_DEFAULT } from '~/utils/constants';

const { ErrorCodes } = core.errors;
const LARGE_AMOUNT = new web3.utils.BN(
  web3.utils.toWei('1000000000000000', 'ether'),
);

// Recursive helper function for findMaxFlow
async function loopFindMaxFlow(
  from,
  to,
  hops,
  attemptsLeft,
  errorsMessages = '',
) {
  if (attemptsLeft === 0 || hops === 0) {
    // ran out of attempts or hops, cannot attempt further
    throw new Error(errorsMessages);
  }
  try {
    return await core.token.findTransitiveTransfer(
      from,
      to,
      LARGE_AMOUNT,
      hops,
    );
  } catch (error) {
    // no path or path too long
    if (
      error.name === 'TransferError' &&
      error.code === ErrorCodes.UNKNOWN_ERROR
    ) {
      // RETRY: with fewer hops
      return await loopFindMaxFlow(
        from,
        to,
        hops - 1,
        attemptsLeft - 1,
        errorsMessages.concat(' ', error.message),
      );
    }
    // GIVE UP: any other errors will result in propagating the error
    else {
      throw error;
    }
  }
}

/**
 * Finds the maximum transferable amount by transitive transfers between two safe addresses
 * @param {string} from Address from which transfer is to be sent
 * @param {string} to Address to receive transfer
 * @param {function} setMaxFlow function to set max flow state variable
 * @returns nothing. Updates MaxFlow state in Freckles.
 */
export async function findMaxFlow(from, to, setMaxFlow) {
  // First attempting via API
  try {
    const response = loopFindMaxFlow(
      from,
      to,
      PATHFINDER_HOPS_DEFAULT,
      PATHFINDER_HOPS_DEFAULT,
    );
    // const response = await core.token.findTransitiveTransfer(
    //   from,
    //   to,
    //   new web3.utils.BN(web3.utils.toWei('1000000000000000', 'ether')), // Has to be a large amount
    //   hops,
    // );

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

  // Then attempt, do contract call
  try {
    const sendLimit = await core.token.checkSendLimit(from, to);
    setMaxFlow(sendLimit);
  } catch (error) {
    setMaxFlow('0');
  }
}
