import React, { Fragment, useEffect, useState } from 'react';
import qs from 'qs';
import {
  Redirect,
  generatePath,
  useHistory,
  useParams,
} from 'react-router-dom';
import {
  Box,
  Container,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Zoom,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import CenteredHeading from '~/components/CenteredHeading';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import TransferInfoBalanceCard from '~/components/TransferInfoBalanceCard';
import TransferInfoCard from '~/components/TransferInfoCard';
import TransferInput from '~/components/TransferInput';
import View from '~/components/View';
import core from '~/services/core';
import logError, { formatErrorMessage } from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import web3 from '~/services/web3';
import { DASHBOARD_PATH, SEND_CONFIRM_PATH } from '~/routes';
import { IconSend } from '~/styles/icons';
import { formatCirclesValue } from '~/utils/format';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { transfer, checkCurrentBalance } from '~/store/token/actions';
import { useQuery } from '~/hooks/url';
import { useUpdateLoop } from '~/hooks/update';
import { useUserdata } from '~/hooks/username';
import { validatePaymentNote, validateAmount } from '~/services/token';

const { ErrorCodes, TransferError } = core.errors;

const useStyles = makeStyles((theme) => ({
  dialogPaymentNote: {
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.grey['900'],
    wordWrap: 'break-word',
  },
}));

const SendConfirm = () => {
  const { address } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  useUpdateLoop(async () => {
    await dispatch(checkCurrentBalance());
  });

  // Set amount and payment note based on URL query
  const {
    a: preselectedAmount = '',
    n: preselectedPaymentNote = '',
  } = useQuery();
  const [amount, setAmount] = useState(
    validateAmount(preselectedAmount) ? preselectedAmount : '',
  );
  const [paymentNote, setPaymentNote] = useState(
    validatePaymentNote(preselectedPaymentNote) ? preselectedPaymentNote : '',
  );

  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [maxFlow, setMaxFlow] = useState(null);

  const { safe, token } = useSelector((state) => state);

  const { username: sender } = useUserdata(safe.currentAccount);
  const { username: receiver } = useUserdata(address);

  const maxAmount = web3.utils.BN.min(
    web3.utils.toBN(token.balance ? token.balance : '0'),
    web3.utils.toBN(maxFlow ? maxFlow : '0'),
  );

  const isAmountTooHigh = amount
    ? web3.utils
        .toBN(maxAmount)
        .lte(
          web3.utils.toBN(
            amount ? web3.utils.toWei(amount.toString(), 'ether') : '0',
          ),
        )
    : false;

  const isPaymentNoteInvalid =
    paymentNote.length > 0 && !validatePaymentNote(paymentNote);

  const updateUrl = (newPaymentNote, newAmount) => {
    const query = qs.stringify({
      a: newAmount,
      n: newPaymentNote,
    });

    history.replace(`${generatePath(SEND_CONFIRM_PATH, { address })}?${query}`);
  };

  const handleAmountChange = (event) => {
    const newAmount = event.target.value;
    if (newAmount && !validateAmount(newAmount)) {
      return;
    }
    setAmount(newAmount);
    updateUrl(paymentNote, newAmount);
  };

  const handlePaymentNoteChange = (event) => {
    const newPaymentNote = event.target.value;
    setPaymentNote(newPaymentNote);
    updateUrl(newPaymentNote, amount);
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
      await dispatch(transfer(address, amount, paymentNote));

      dispatch(
        notify({
          text: translate('SendConfirm.successMessage', {
            amount,
            username: receiver,
          }),
          type: NotificationsTypes.SUCCESS,
        }),
      );

      setIsSent(true);
    } catch (error) {
      logError(error);
      let text;

      if (error instanceof TransferError) {
        // Convert TransferError codes into human readable error messages
        let messageId = 'Unknown';
        if (error.code === ErrorCodes.TOO_COMPLEX_TRANSFER) {
          messageId = 'TooComplex';
        } else if (error.code === ErrorCodes.INVALID_TRANSFER) {
          messageId = 'Invalid';
        } else if (error.code === ErrorCodes.TRANSFER_NOT_FOUND) {
          messageId = 'NotFound';
        }
        text = translate('SendConfirm.errorMessageTransfer' + messageId, {
          amount,
          username: receiver,
        });
      } else {
        text = translate('SendConfirm.errorMessage', {
          errorMessage: formatErrorMessage(error),
        });
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

  useEffect(() => {
    const getMaxFlow = async () => {
      // First attempt, try via API
      try {
        const response = await core.token.findTransitiveTransfer(
          safe.currentAccount,
          address,
          new web3.utils.BN(web3.utils.toWei('1000000000000000', 'ether')), // Has to be a large amount
        );

        // Throw an error when no path was found, we should try again with
        // checking direct sends as the API might not be in sync yet
        if (response.maxFlowValue === '0') {
          throw new Error('Zero value found when asking API');
        }

        setMaxFlow(response.maxFlowValue);
        return;
      } catch {
        setMaxFlow('0');
      }

      // Second attempt, do contract call
      try {
        const sendLimit = await core.token.checkSendLimit(
          safe.currentAccount,
          address,
        );
        setMaxFlow(sendLimit);
      } catch (error) {
        setMaxFlow('0');
      }
    };

    getMaxFlow();
  }, [address, safe.currentAccount]);

  if (isSent) {
    return <Redirect to={DASHBOARD_PATH} />;
  }

  return (
    <Fragment>
      <Dialog
        aria-describedby={`dialog-send-text`}
        aria-labelledby={`dialog-send-description`}
        open={isConfirmationShown}
        onClose={handleConfirmClose}
      >
        <DialogContent>
          <Typography align="center" variant="h6">
            @{sender}
          </Typography>
          <Zoom
            in={isConfirmationShown}
            style={{ transitionDelay: isConfirmationShown ? '250ms' : '0ms' }}
          >
            <Box
              my={2}
              style={{
                textAlign: 'center',
                fontSize: '100px',
                height: '100px',
              }}
            >
              <IconSend color="primary" fontSize="inherit" />
            </Box>
          </Zoom>
          <Typography align="center" gutterBottom>
            {translate('SendConfirm.dialogSendDescription', {
              amount,
              username: receiver,
            })}
          </Typography>
          <Typography align="center" className={classes.dialogPaymentNote}>
            {paymentNote}
          </Typography>
          <Box mb={1} mt={2}>
            <Button autoFocus fullWidth isPrimary onClick={handleSend}>
              {translate('SendConfirm.dialogSendConfirm')}
            </Button>
          </Box>
          <Box mb={2}>
            <Button fullWidth isOutline onClick={handleConfirmClose}>
              {translate('SendConfirm.dialogSendCancel')}
            </Button>
          </Box>
        </DialogContent>
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TransferInfoBalanceCard
                address={safe.currentAccount}
                balance={token.balance ? token.balance : '0'}
                isLoading={token.balance === null}
                label={translate('SendConfirm.formSender')}
              />
            </Grid>
            <Grid item xs={12}>
              <TransferInfoCard
                address={address}
                isLoading={maxFlow === null}
                label={translate('SendConfirm.formReceiver')}
                text={translate('SendConfirm.bodyMaxFlow', {
                  amount: maxFlow !== null ? formatCirclesValue(maxAmount) : '',
                })}
                tooltip={translate('SendConfirm.tooltipMaxFlow', {
                  username: receiver,
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TransferInput
                autoFocus
                errorMessage={translate('SendConfirm.bodyAmountTooHigh', {
                  count: formatCirclesValue(maxAmount),
                  username: receiver,
                })}
                id="amount"
                isError={isAmountTooHigh}
                label={translate('SendConfirm.formAmount')}
                value={amount}
                onChange={handleAmountChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TransferInput
                errorMessage={translate('SendConfirm.bodyPaymentNoteInvalid')}
                id="payment-note"
                isError={isPaymentNoteInvalid}
                label={translate('SendConfirm.formPaymentNote')}
                value={paymentNote}
                onChange={handlePaymentNoteChange}
              />
            </Grid>
          </Grid>
        </Container>
      </View>
      <Footer>
        <Button
          disabled={
            !amount || amount <= 0 || isAmountTooHigh || isPaymentNoteInvalid
          }
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
