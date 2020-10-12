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
  Card,
  CardHeader,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  FormHelperText,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Tooltip,
  Typography,
  Zoom,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import CenteredHeading from '~/components/CenteredHeading';
import CirclesLogoSVG from '%/images/logo.svg';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';
import core from '~/services/core';
import logError, { formatErrorMessage } from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import web3 from '~/services/web3';
import { DASHBOARD_PATH, SEND_CONFIRM_PATH } from '~/routes';
import { IconCircles, IconSend } from '~/styles/icons';
import { formatCirclesValue } from '~/utils/format';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { transfer } from '~/store/token/actions';
import { useQuery } from '~/hooks/url';
import { useUserdata } from '~/hooks/username';
import { validatePaymentNote, validateAmount } from '~/services/token';

const { ErrorCodes, TransferError } = core.errors;

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: theme.spacing(1),
  },
  inputLabel: {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: 12,
  },
  totalBalance: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: 12,
    '&>*': {
      marginRight: theme.spacing(0.5),
    },
  },
  inputAmount: {
    fontSize: 27,
  },
  inputError: {
    '&.Mui-error': {
      color: theme.custom.colors.red,
    },
  },
  inputAmountError: {
    color: theme.custom.colors.red,
  },
  paper: {
    minHeight: 66,
  },
  input: {
    padding: theme.spacing(2),
    height: 66,
    boxShadow: 'inset 1px 1px 1px 1px rgba(0,0,0,0.15)',
  },
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

  const maxAmount = parseFloat(
    formatCirclesValue(
      web3.utils.BN.min(
        web3.utils.toBN(token.balance),
        web3.utils.toBN(
          web3.utils.toWei(maxFlow ? `${maxFlow}` : '0', 'ether'),
        ),
      ),
    ),
  );

  const isAmountTooHigh = (amount ? parseFloat(amount) : 0) > maxAmount;
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
      try {
        const response = await core.token.findTransitiveTransfer(
          safe.currentAccount,
          address,
          new web3.utils.BN(web3.utils.toWei('1', 'ether')), // Any amount works here
        );
        setMaxFlow(response.maxFlowValue);
      } catch (error) {
        setMaxFlow(0);
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
              <InputLabel className={classes.inputLabel} htmlFor="receiver">
                {translate('SendConfirm.formSender')}
              </InputLabel>
              <Card>
                <CardHeader
                  avatar={<Avatar address={safe.currentAccount} size="tiny" />}
                  classes={{
                    root: classes.cardHeader,
                  }}
                  subheader={
                    <Tooltip
                      arrow
                      title={translate('SendConfirm.tooltipTotalBalance')}
                    >
                      <Typography
                        className={classes.totalBalance}
                        component="div"
                      >
                        <CirclesLogoSVG height="12" width="12" />
                        <span>
                          {translate('SendConfirm.bodyTotalBalance', {
                            balance: formatCirclesValue(token.balance),
                          })}
                        </span>
                      </Typography>
                    </Tooltip>
                  }
                  title={`@${sender}`}
                />
              </Card>
            </Grid>
            <Grid item xs={12}>
              <InputLabel className={classes.inputLabel} htmlFor="receiver">
                {translate('SendConfirm.formReceiver')}
              </InputLabel>
              <Card>
                <CardHeader
                  avatar={<Avatar address={address} size="tiny" />}
                  classes={{
                    root: classes.cardHeader,
                  }}
                  subheader={
                    <Tooltip
                      arrow
                      title={translate('SendConfirm.tooltipMaxFlow', {
                        username: receiver,
                      })}
                    >
                      <Typography
                        className={classes.totalBalance}
                        component="div"
                      >
                        <CirclesLogoSVG height="12" width="12" />
                        <span>
                          {translate('SendConfirm.bodyMaxFlow', {
                            amount:
                              maxFlow !== null
                                ? formatCirclesValue(
                                    web3.utils.toWei(`${maxFlow}`, 'ether'),
                                  )
                                : '',
                          })}
                        </span>
                        {maxFlow === null && <CircularProgress size={12} />}
                      </Typography>
                    </Tooltip>
                  }
                  title={`@${receiver}`}
                />
              </Card>
            </Grid>
            <Grid item xs={12}>
              <InputLabel className={classes.inputLabel} htmlFor="amount">
                {translate('SendConfirm.formAmount')}
              </InputLabel>
              <Input
                autoFocus
                classes={{
                  root: classes.input,
                  input: classes.inputAmount,
                  error: classes.inputAmountError,
                }}
                disableUnderline
                error={isAmountTooHigh}
                fullWidth
                id="amount"
                inputProps={{
                  min: 0,
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <IconCircles />
                  </InputAdornment>
                }
                type="number"
                value={amount}
                onChange={handleAmountChange}
              />
              {isAmountTooHigh && (
                <FormHelperText className={classes.inputError} error>
                  {translate('SendConfirm.bodyAmountTooHigh', {
                    count: formatCirclesValue(
                      web3.utils.toWei(`${maxAmount}`, 'ether'),
                    ),
                    username: receiver,
                  })}
                </FormHelperText>
              )}
            </Grid>
            <Grid item xs={12}>
              <InputLabel className={classes.inputLabel} htmlFor="payment-note">
                {translate('SendConfirm.formPaymentNote')}
              </InputLabel>
              <Input
                className={classes.input}
                disableUnderline
                error={isPaymentNoteInvalid}
                fullWidth
                id="payment-note"
                value={paymentNote}
                onChange={handlePaymentNoteChange}
              />
              {isPaymentNoteInvalid && (
                <FormHelperText className={classes.inputError} error>
                  {translate('SendConfirm.bodyPaymentNoteInvalid')}
                </FormHelperText>
              )}
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
