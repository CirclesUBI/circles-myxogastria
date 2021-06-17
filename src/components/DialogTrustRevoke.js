import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

import Dialog from '~/components/Dialog';
import { useUserdata } from '~/hooks/username';
import translate from '~/services/locale';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { untrustUser } from '~/store/trust/actions';
import logError from '~/utils/debug';

const DialogTrustRevoke = ({
  address,
  isOpen,
  onClose,
  onSuccess,
  onConfirm,
  onError,
}) => {
  const dispatch = useDispatch();
  const { username } = useUserdata(address);

  const handleRevokeTrustClose = () => {
    onClose && onClose();
  };

  const handleRevokeTrust = async () => {
    dispatch(showSpinnerOverlay());
    onConfirm && onConfirm();

    try {
      await dispatch(untrustUser(address));

      dispatch(
        notify({
          text: translate('DialogTrustRevoke.successRevokeTrust', {
            username,
          }),
          type: NotificationsTypes.SUCCESS,
        }),
      );

      onSuccess && onSuccess();
    } catch (error) {
      logError(error);

      dispatch(
        notify({
          text: translate('DialogTrustRevoke.errorRevokeTrust', {
            username,
          }),
          type: NotificationsTypes.ERROR,
        }),
      );

      onError && onError();
    }

    dispatch(hideSpinnerOverlay());
  };

  return (
    <Dialog
      cancelLabel={translate('DialogTrustRevoke.dialogRevokeTrustCancel')}
      confirmLabel={translate('DialogTrustRevoke.dialogRevokeTrustConfirm')}
      id="revoke-trust"
      open={isOpen}
      text={translate('DialogTrustRevoke.dialogRevokeTrustDescription', {
        username,
      })}
      title={translate('DialogTrustRevoke.dialogRevokeTrustTitle', {
        username,
      })}
      onClose={handleRevokeTrustClose}
      onConfirm={handleRevokeTrust}
    />
  );
};

DialogTrustRevoke.propTypes = {
  address: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

export default DialogTrustRevoke;
