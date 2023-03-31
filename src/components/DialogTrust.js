import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
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

const useStyles = makeStyles((theme) => ({
  paragraph: {
    color: theme.custom.colors.grayLightest,
    fontWeight: 500,
  },
  link: {
    color: theme.custom.colors.grayLightest,

    '& p': {
      fontWeight: 500,
    },
  },
}));

const DialogTrust = ({
  address,
  isOpen,
  onClose,
  onSuccess,
  onConfirm,
  onError,
}) => {
  const classes = useStyles();
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
          type: NotificationsTypes.INFO,
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
    <DialogPurple
      cancelLabel={translate('DialogTrust.dialogTrustCancel')}
      confirmLabel={translate('DialogTrust.dialogTrustConfirm')}
      id="trust"
      open={isOpen}
      title={translate('DialogTrust.dialogTrustTitle', { username })}
      onClose={handleTrustClose}
      onConfirm={handleTrust}
    >
      <Box display="flex" justifyContent="center" mb={2}>
        <Avatar address={address} size="medium" />
      </Box>
      <Typography className={classes.paragraph} paragraph>
        {translate('DialogTrust.dialogTrustDescription', { username })}
      </Typography>
      <ExternalLink className={classes.link} href={FAQ_URL}>
        <Typography paragraph sx={{ textDecoration: 'underline' }}>
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
