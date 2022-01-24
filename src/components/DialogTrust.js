import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

import Avatar from '~/components/Avatar';
import Dialog from '~/components/Dialog';
import { useUserdata } from '~/hooks/username';
import translate from '~/services/locale';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { trustUser } from '~/store/trust/actions';
import logError from '~/utils/debug';

const DialogTrust = ({
  address,
  isOpen,
  onClose,
  onSuccess,
  onConfirm,
  onError,
}) => {
  const dispatch = useDispatch();
  const { username } = useUserdata(address);

  const handleTrustClose = () => {
    onClose && onClose();
  };

  const handleTrust = async () => {
    dispatch(showSpinnerOverlay());
    onConfirm && onConfirm();

    try {
      await dispatch(trustUser(address));

      dispatch(
        notify({
          text: translate('DialogTrust.successTrust', {
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
          text: translate('DialogTrust.errorTrust', {
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
      avatar={<Avatar address={address} size="smallXl" />}
      cancelLabel={translate('DialogTrust.dialogTrustCancel')}
      confirmLabel={translate('DialogTrust.dialogTrustConfirm')}
      externalPath="#"
      id="trust"
      open={isOpen}
      text={translate('DialogTrust.dialogTrustDescription', { username })}
      title={translate('DialogTrust.dialogTrustTitle', { username })}
      onClose={handleTrustClose}
      onConfirm={handleTrust}
    ></Dialog>
  );
};

DialogTrust.propTypes = {
  address: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

export default DialogTrust;
