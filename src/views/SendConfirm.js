import React, { Fragment, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Input,
  Typography,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import CenteredHeading from '~/components/CenteredHeading';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import ProfileMini from '~/components/ProfileMini';
import View from '~/components/View';
import core from '~/services/core';
import logError, { formatErrorMessage } from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { DASHBOARD_PATH } from '~/routes';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { transfer } from '~/store/token/actions';
import { useUserdata } from '~/hooks/username';

const SendConfirm = () => {
  const { address } = useParams();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);
  const [isSent, setIsSent] = useState(false);
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);

  const { username } = useUserdata(address);

  const onAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleConfirmOpen = () => {
    setIsConfirmationShown(true);
  };

  const handleConfirmClose = () => {
    setIsConfirmationShown(false);
  };

  const handleSend = async () => {
    dispatch(showSpinnerOverlay());
    setIsConfirmationShown(false);

    try {
      await dispatch(transfer(address, amount));

      dispatch(
        notify({
          text: translate('SendConfirm.successMessage', {
            amount,
            username,
          }),
          type: NotificationsTypes.SUCCESS,
        }),
      );

      setIsSent(true);
    } catch (error) {
      logError(error);
      let text;

      if (error instanceof core.errors.TransferError) {
        text = translate('SendConfirm.errorMessageTransfer', {
          amount,
          username,
        });
      } else {
        const errorMessage = formatErrorMessage(error);
        text = `${translate('SendConfirm.errorMessage')}${errorMessage}`;
      }

      dispatch(
        notify({
          text,
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  if (isSent) {
    return <Redirect to={DASHBOARD_PATH} />;
  }

  return (
    <Fragment>
      <Dialog
        aria-describedby="alert-send-description"
        aria-labelledby="alert-send-title"
        open={isConfirmationShown}
        onClose={handleConfirmClose}
      >
        <DialogTitle id="alert-send-title">
          {translate('SendConfirm.dialogSendTitle', { amount, username })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-send-description">
            {translate('SendConfirm.dialogSendDescription', {
              amount,
              username,
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button isOutline onClick={handleConfirmClose}>
            {translate('SendConfirm.dialogSendCancel')}
          </Button>
          <Button autoFocus isPrimary onClick={handleSend}>
            {translate('SendConfirm.dialogSendConfirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <Header>
        <ButtonBack />
        <CenteredHeading>
          {translate('SendConfirm.headingSendCircles')}
        </CenteredHeading>
        <ButtonHome edge="end" />
      </Header>
      <View>
        <Container maxWidth="sm">
          <Box my={4}>
            <Typography align="center" gutterBottom>
              {translate('SendConfirm.bodyTo')}
            </Typography>
            <ProfileMini address={address} />
          </Box>
          <Typography align="center" gutterBottom>
            {translate('SendConfirm.bodyHowMuch')}
          </Typography>
          <Paper>
            <Box p={2}>
              <Input
                disableUnderline={true}
                fullWidth
                inputProps={{
                  min: 0,
                }}
                type="number"
                value={amount}
                onChange={onAmountChange}
              />
            </Box>
          </Paper>
        </Container>
      </View>
      <Footer>
        <Button
          disabled={!(amount > 0)}
          fullWidth
          isPrimary
          onClick={handleConfirmOpen}
        >
          {translate('SendConfirm.buttonSubmitAmount')}
        </Button>
      </Footer>
    </Fragment>
  );
};

export default SendConfirm;
