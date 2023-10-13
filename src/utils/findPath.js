import { ethers } from 'ethers';

import core from '~/services/core';
import { PATHFINDER_HOPS_DEFAULT } from '~/utils/constants';

const { ErrorCodes } = core.errors;
// The pathfinder returns a maximum transfer value when a too large amount
// is specified as amount. If the amount is lower than the maximum possible
// transfers it will not return the maximum.
// We use 10^15 CRC as this is much higher than any realistic transfer.
const LARGE_AMOUNT = ethers.BigNumber.from(
  core.utils.toFreckles('1000000000000000'),
);

// Recursive helper function for findMaxFlow recursively reducing number of hops
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
  // First attempting via API.
  // The API parameters depends on the Pathfinder Type in use:
  // The 'cli' uses hops, but this option is not available in the 'server'.
  // Therefore we set the attemptsLeft and the hops option will be ignored.
  try {
    let response;
    if (process.env.PATHFINDER_TYPE === 'cli') {
      response = await loopFindMaxFlow(
        from,
        to,
        PATHFINDER_HOPS_DEFAULT,
        PATHFINDER_HOPS_DEFAULT,
      );
    } else {
      response = await core.token.findTransitiveTransfer(
        from,
        to,
        LARGE_AMOUNT,
      );
    }

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
