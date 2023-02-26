import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
  Zoom,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import { FAQ_URL } from '../utils/constants';

import Button from '~/components/Button';
import ExternalLink from '~/components/ExternalLink';
import translate from '~/services/locale';
import { IconSend } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  dialogPaymentNote: {
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.grey['900'],
    wordWrap: 'break-word',
  },
  sendIcon: {
    color: theme.custom.colors.disco,
    fontSize: 'inherit',
  },
  iconContainer: {
    textAlign: 'center',
    fontSize: '100px',
    height: '100px',
  },
}));

const SendConfirmDialog = ({
  amount,
  isConfirmationShown,
  isLoadingConfirmationShown,
  paymentNote,
  receiver,
  sender,
  handleConfirmClose,
  handleSend,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      aria-describedby={`dialog-send-text`}
      aria-labelledby={`dialog-send-description`}
      fullWidth
      maxWidth="xs"
      open={isConfirmationShown || isLoadingConfirmationShown}
      onClose={handleConfirmClose}
    >
      <DialogContent>
        <Typography align="center" variant="h6">
          @{sender}
        </Typography>
        {isConfirmationShown && (
          <Zoom
            in={isConfirmationShown}
            style={{ transitionDelay: isConfirmationShown ? '250ms' : '0ms' }}
          >
            <Box
              className={classes.iconContainer}
              my={2}
              style={{
                textAlign: 'center',
              }}
            >
              <IconSend className={classes.sendIcon} />
            </Box>
          </Zoom>
        )}
        {isConfirmationShown && (
          <>
            <Typography align="center" gutterBottom>
              {translate('SendConfirm.dialogSendDescription', {
                amount,
                username: receiver,
              })}
            </Typography>
            <Typography align="center" className={classes.dialogPaymentNote}>
              {paymentNote}
            </Typography>
            <Box maxWidth="60%" mb={1} mt={2} mx="auto">
              <Button autoFocus fullWidth onClick={handleSend}>
                {translate('SendConfirm.dialogSendConfirm')}
              </Button>
            </Box>
            <Box maxWidth="60%" mb={2} mx="auto">
              <Button fullWidth isOutline onClick={handleConfirmClose}>
                {translate('SendConfirm.dialogSendCancel')}
              </Button>
            </Box>
          </>
        )}
        {isLoadingConfirmationShown && (
          <>
            <Box align="center" my={8}>
              <CircularProgress size={75} />
            </Box>
            <Typography align="center" mb={6}>
              {translate('SendConfirm.transferringCirclesInfo')}
            </Typography>
            <Box mb={6} mt={1}>
              <ExternalLink href={FAQ_URL} type="underline">
                <Typography align="center">
                  {translate('SendConfirm.readMoreLink')}
                </Typography>
              </ExternalLink>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

SendConfirmDialog.propTypes = {
  amount: PropTypes.string.isRequired,
  handleConfirmClose: PropTypes.func.isRequired,
  handleSend: PropTypes.func.isRequired,
  isConfirmationShown: PropTypes.bool,
  isLoadingConfirmationShown: PropTypes.bool,
  paymentNote: PropTypes.string,
  receiver: PropTypes.string.isRequired,
  sender: PropTypes.string.isRequired,
};

export default SendConfirmDialog;
