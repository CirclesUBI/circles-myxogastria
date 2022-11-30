/*eslint-disable*/
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import core from '~/services/core';
import translate from '~/services/locale';
import { getSafeVersion, setSafeVersion } from '~/services/safe';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { updateSafeVersion } from '~/store/safe/actions';
import { SAFE_CRC_VERSION, SAFE_LAST_VERSION } from '~/utils/constants';
import logError, {
  formatErrorMessage,
  translateErrorForUser,
} from '~/utils/debug';

const { ErrorCodes, TransferError, RequestError, CoreError } = core.errors;

const SafeVersion = () => {
  const dispatch = useDispatch();
  const { safe } = useSelector((state) => state);

  console.log('I am safe version');

  useEffect(() => {
    // If no safe address or version is already the last

    // if (
    //   !safe.currentAccount ||
    //   (safe.safeVersion && safe.safeVersion === SAFE_LAST_VERSION) ||
    //   getSafeVersion() === SAFE_LAST_VERSION
    // ) {
    //   return;
    // }

    const checkSafeVersion = async () => {
      // Check that the Safe version is the Circles base version

      const currentSafeVersion = await core.safe.getVersion(
        safe.currentAccount,
      );

      // if (currentSafeVersion !== SAFE_CRC_VERSION) {
      //   setSafeVersion(currentSafeVersion);
      //   return;
      // }

      try {
        // .. and update the Safe!
        console.log('dispatch updateSafeVersion');
        await dispatch(updateSafeVersion());

        const version = await core.safe.getVersion(safe.currentAccount);

        // Display the action to the user
        dispatch(
          notify({
            text: translate('SafeVersion.infoUpdatedVersion', {
              version: version,
            }),
            type: NotificationsTypes.INFO,
            timeout: 10000,
          }),
        );
      } catch (error) {
        console.log('I catch an error from updateSafeVersion');

        console.log(
          'SaveVersion error instanceof CoreError',
          error instanceof CoreError,
        );
        console.log('SaveVersion error.code', error.code);
        console.log('SaveVersion error', { error });

        const errorMessage = translateErrorForUser(error);
        // Display the action to the user
        // console.log(
        //   'translateErrorForUser(error)2',
        //   translateErrorForUser(error),
        // );
        // console.log('error.code2', error.code);
        // console.log(
        //   'ErrorCodes.INSUFFICIENT_FUNDS',
        //   ErrorCodes.INSUFFICIENT_FUNDS,
        // );
        // console.log('errorMessage', errorMessage);

        // console.log('error instanceof CoreError', error instanceof CoreError);
        // debugger;
        dispatch(
          notify({
            // text: translateErrorForUser(error),
            text: `tsett ${errorMessage}`,

            type: NotificationsTypes.ERROR,
            timeout: 10000,
          }),
        );
        logError(error);
      }
    };

    checkSafeVersion();
  }, [dispatch, safe.currentAccount, safe.safeVersion]);

  return null;
};

export default SafeVersion;
/*eslint-enable*/
