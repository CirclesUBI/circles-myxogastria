import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import core from '~/services/core';
import translate from '~/services/locale';
import { getSafeVersion, setSafeVersion } from '~/services/safe';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { updateSafeVersion } from '~/store/safe/actions';
import { SAFE_CRC_VERSION, SAFE_LAST_VERSION } from '~/utils/constants';
import logError, { translateErrorForUser } from '~/utils/debug';

const SafeVersion = () => {
  const dispatch = useDispatch();
  const { safe } = useSelector((state) => state);

  useEffect(() => {
    // If no safe address or version is already the last
    if (
      !safe.currentAccount ||
      (safe.safeVersion && safe.safeVersion === SAFE_LAST_VERSION) ||
      getSafeVersion() === SAFE_LAST_VERSION
    ) {
      return;
    }

    const checkSafeVersion = async () => {
      // Check that the Safe version is the Circles base version
      const currentSafeVersion = await core.safe.getVersion(
        safe.currentAccount,
      );

      if (currentSafeVersion !== SAFE_CRC_VERSION) {
        setSafeVersion(currentSafeVersion);
        return;
      }

      try {
        const currentSafeVersion = await core.safe.getVersion(
          safe.currentAccount,
        );
        if (currentSafeVersion !== SAFE_CRC_VERSION) {
          setSafeVersion(currentSafeVersion);
          return;
        }

        // .. and update the Safe!
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
        dispatch(
          notify({
            text: translateErrorForUser(error),
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
