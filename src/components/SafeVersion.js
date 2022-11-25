import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import core from '~/services/core';
import translate from '~/services/locale';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { updateSafeVersion } from '~/store/safe/actions';
import { SAFE_CRC_VERSION, SAFE_LAST_VERSION } from '~/utils/constants';

const SafeVersion = () => {
  const dispatch = useDispatch();
  const { safe } = useSelector((state) => state);

  useEffect(() => {
    // If no safe address or version is already the last
    if (
      !safe.currentAccount ||
      (safe.safeVersion && safe.safeVersion === SAFE_LAST_VERSION)
    ) {
      return;
    }

    const checkSafeVersion = async () => {
      // Check that the Safe version is the Circles base version
      if (
        (await core.safe.getVersion(safe.currentAccount)) !== SAFE_CRC_VERSION
      ) {
        return;
      }

      // .. and update the Safe!
      await dispatch(await updateSafeVersion());

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
    };

    checkSafeVersion();
  }, [dispatch, safe.currentAccount, safe.safeVersion]);

  return null;
};

export default SafeVersion;
