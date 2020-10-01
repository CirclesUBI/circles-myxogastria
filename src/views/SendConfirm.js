import React, { Fragment, useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Container,
  FormHelperText,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import CenteredHeading from '~/components/CenteredHeading';
import CirclesLogoSVG from '%/images/logo.svg';
import Dialog from '~/components/Dialog';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';
import core from '~/services/core';
import logError, { formatErrorMessage } from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import web3 from '~/services/web3';
import { DASHBOARD_PATH } from '~/routes';
import { IconCircles } from '~/styles/icons';
import { formatCirclesValue } from '~/utils/format';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { transfer } from '~/store/token/actions';
import { useUserdata } from '~/hooks/username';

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
  inputAmountError: {
    color: 'red',
  },
  paper: {
    minHeight: 66,
  },
}));

const SendConfirm = () => {
  const classes = useStyles();
  const { address } = useParams();

  const dispatch = useDispatch();
  const { safe, token } = useSelector((state) => state);

  const [amount, setAmount] = useState('');
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [maxFlow, setMaxFlow] = useState(null);
  const [paymentNote, setPaymentNote] = useState('');

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

  const handleAmountChange = (event) => {
    if (isNaN(event.target.value)) {
      return;
    }
    setAmount(event.target.value);
  };

  const handlePaymentNoteChange = (event) => {
    setPaymentNote(event.target.value);
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

      if (error instanceof core.errors.TransferError) {
        text = translate('SendConfirm.errorMessageTransfer', {
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
          new web3.utils.BN('1'), // Any amount works here
        );
        setMaxFlow(new web3.utils.BN(response.maxFlow));
      } catch (error) {
        setMaxFlow(new web3.utils.BN('0'));
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
        cancelLabel={translate('SendConfirm.dialogSendCancel')}
        confirmLabel={translate('SendConfirm.dialogSendConfirm')}
        id="send"
        open={isConfirmationShown}
        text={translate('SendConfirm.dialogSendDescription', {
          amount,
          username: receiver,
        })}
        title={translate('SendConfirm.dialogSendTitle', {
          amount,
          username: receiver,
        })}
        onClose={handleConfirmClose}
        onConfirm={handleSend}
      />
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
                            amount: maxFlow ? formatCirclesValue(maxFlow) : '',
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
              <Paper className={classes.paper}>
                <Box p={2}>
                  <Input
                    autoFocus
                    classes={{
                      input: classes.inputAmount,
                      error: classes.inputAmountError,
                    }}
                    disableUnderline
                    error={isAmountTooHigh}
                    fullWidth
                    id="amount"
                    startAdornment={
                      <InputAdornment position="start">
                        <IconCircles />
                      </InputAdornment>
                    }
                    value={amount}
                    onChange={handleAmountChange}
                  />
                  {isAmountTooHigh && (
                    <FormHelperText error>
                      {translate('SendConfirm.bodyAmountTooHigh', {
                        count: maxAmount,
                        username: receiver,
                      })}
                    </FormHelperText>
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <InputLabel className={classes.inputLabel} htmlFor="payment-note">
                {translate('SendConfirm.formPaymentNote')}
              </InputLabel>
              <Paper className={classes.paper}>
                <Box p={2}>
                  <Input
                    disableUnderline
                    fullWidth
                    id="payment-note"
                    value={paymentNote}
                    onChange={handlePaymentNoteChange}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </View>
      <Footer>
        <Button
          disabled={!amount || amount <= 0 || isAmountTooHigh}
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
