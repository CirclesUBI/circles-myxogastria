import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

import Avatar from '~/components/Avatar';
import DialogPurple from '~/components/DialogPurple';
import ExternalLink from '~/components/ExternalLink';
import { useUserdata } from '~/hooks/username';
import translate from '~/services/locale';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { trustUser } from '~/store/trust/actions';
import { FAQ_URL } from '~/utils/constants';
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
          text: (
            <Typography classes={{ root: 'body4_white' }} variant="body4">
              {translate('DialogTrust.successTrust', {
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
              {translate('DialogTrust.errorTrust', {
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
      cancelLabel={translate('DialogTrust.dialogTrustCancel')}
      confirmLabel={translate('DialogTrust.dialogTrustConfirm')}
      id="trust"
      open={isOpen}
      title={
        <Typography classes={{ root: 'h4_link_white' }} variant="h4">
          {translate('DialogTrust.dialogTrustTitle', { username })}
        </Typography>
      }
      onClose={handleTrustClose}
      onConfirm={handleTrust}
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
        {translate('DialogTrust.dialogTrustDescription', { username })}
      </Typography>
      <ExternalLink href={FAQ_URL}>
        <Typography
          align="center"
          classes={{ root: 'body3_link' }}
          paragraph
          variant="body3"
        >
          {translate('DialogAddMember.linkLearnMore')}
        </Typography>
      </ExternalLink>
    </DialogPurple>
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
