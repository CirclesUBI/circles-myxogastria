import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

import Avatar from '~/components/Avatar';
import DialogPurple from '~/components/DialogPurple';
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
          text: (
            <Typography classes={{ root: 'body4_white' }} variant="body4">
              {translate('DialogTrustRevoke.successRevokeTrust', {
                username,
              })}
            </Typography>
          ),
          type: NotificationsTypes.INFO,
        }),
      );

      onSuccess && onSuccess();
    } catch (error) {
      logError(error);

      dispatch(
        notify({
          text: (
            <Typography classes={{ root: 'body4_white' }} variant="body4">
              {translate('DialogTrustRevoke.errorRevokeTrust', {
                username,
              })}
            </Typography>
          ),
          type: NotificationsTypes.ERROR,
        }),
      );

      onError && onError();
    }

    dispatch(hideSpinnerOverlay());
  };

  return (
    <DialogPurple
      cancelLabel={translate('DialogTrustRevoke.dialogRevokeTrustCancel')}
      confirmLabel={translate('DialogTrustRevoke.dialogRevokeTrustConfirm')}
      id="revoke-trust"
      open={isOpen}
      title={translate('DialogTrustRevoke.dialogRevokeTrustTitle', {
        username,
      })}
      onClose={handleRevokeTrustClose}
      onConfirm={handleRevokeTrust}
    >
      <Box display="flex" justifyContent="center" mb={2}>
        <Avatar address={address} size="medium" />
      </Box>
      <Typography
        align="center"
        classes={{ root: 'body1_white' }}
        paragraph
        variant="body1"
      >
        {translate('DialogTrustRevoke.dialogRevokeTrustDescription', {
          username,
        })}
      </Typography>
    </DialogPurple>
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
