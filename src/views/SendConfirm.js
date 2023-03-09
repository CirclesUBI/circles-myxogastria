/* eslint-disable */
import { Container, Grid } from '@material-ui/core';
import qs from 'qs';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Redirect,
  generatePath,
  useHistory,
  useParams,
} from 'react-router-dom';

import { DASHBOARD_PATH, SEND_CONFIRM_PATH } from '~/routes';
import { PATHFINDER_HOPS_DEFAULT } from '~/utils/constants';

import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import CenteredHeading from '~/components/CenteredHeading';
import DialogSendConfirm from '~/components/DialogSendConfirm';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import TransferCirclesInput from '~/components/TransferCirclesInput';
import TransferInfoBalanceCard from '~/components/TransferInfoBalanceCard';
import TransferInfoCard from '~/components/TransferInfoCard';
import TransferInput from '~/components/TransferInput';
import View from '~/components/View';
import { useUpdateLoop } from '~/hooks/update';
import { useQuery } from '~/hooks/url';
import { useUserdata } from '~/hooks/username';
import core from '~/services/core';
import translate from '~/services/locale';
import { validateAmount, validatePaymentNote } from '~/services/token';
import web3 from '~/services/web3';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { checkCurrentBalance, transfer } from '~/store/token/actions';
import logError, { formatErrorMessage } from '~/utils/debug';
import { findMaxFlow } from '~/utils/findPath';
import { formatCirclesValue } from '~/utils/format';

const { ErrorCodes, TransferError } = core.errors;

const SendConfirm = () => {
  const { address } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  useUpdateLoop(async () => {
    await dispatch(checkCurrentBalance());
  });

  // Set amount and payment note based on URL query
  const { a: preselectedAmount = '', n: preselectedPaymentNote = '' } =
    useQuery();
  const [amount, setAmount] = useState(
    validateAmount(preselectedAmount) ? preselectedAmount : '',
  );
  const [paymentNote, setPaymentNote] = useState(
    validatePaymentNote(preselectedPaymentNote) ? preselectedPaymentNote : '',
  );

  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [isLoadingConfirmationShown, setIsLoadingConfirmationShown] =
    useState(false);
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
    ? Number(formatCirclesValue(maxAmount)) < Number(amount)
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
    setIsConfirmationShown(false);

    setIsLoadingConfirmationShown(true);

    console.log('We are sending!');

    try {
      function additionalAction() {
        dispatch(
          notify({
            text: translate('SendConfirm.errorMessageTransferUnknown'),
            type: NotificationsTypes.ERROR,
          }),
        );
        setIsLoadingConfirmationShown(false);
      }

      await dispatch(
        transfer(
          address,
          amount,
          paymentNote,
          PATHFINDER_HOPS_DEFAULT,
          PATHFINDER_HOPS_DEFAULT + 1,
          additionalAction,
        ),
      );

      const text = (
        <span
          dangerouslySetInnerHTML={{
            __html: translate('SendConfirm.successMessage', {
              amount,
              username: receiver,
            }),
          }}
        />
      );

      dispatch(
        notify({
          text,
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

    setIsLoadingConfirmationShown(false);
  };

  let amountErrorBool;
  if (maxAmount.words && maxAmount.words.length >= 0) {
    amountErrorBool = maxAmount.words[0] != 0;
  }

  useEffect(() => {
    findMaxFlow(safe.currentAccount, address, setMaxFlow);
  }, [address, safe.currentAccount]);

  if (isSent) {
    return <Redirect to={DASHBOARD_PATH} />;
  }

  return (
    <Fragment>
      <DialogSendConfirm
        amount={amount}
        handleConfirmClose={handleConfirmClose}
        handleSend={handleSend}
        isConfirmationShown={isConfirmationShown}
        isLoadingConfirmationShown={isLoadingConfirmationShown}
        paymentNote={paymentNote}
        receiver={receiver}
        sender={sender}
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
                  amount:
                    maxFlow !== null && maxFlow != '0'
                      ? formatCirclesValue(maxAmount)
                      : maxFlow == '0'
                      ? translate('SendConfirm.errorMessageCannotBeCalculated')
                      : '',
                })}
                tooltip={translate('SendConfirm.tooltipMaxFlow', {
                  username: receiver,
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TransferCirclesInput
                autoFocus
                errorMessage={translate('SendConfirm.bodyAmountTooHigh', {
                  count: formatCirclesValue(maxAmount),
                  username: receiver,
                })}
                id="amount"
                isError={amountErrorBool && isAmountTooHigh}
                label={translate('SendConfirm.formAmount')}
                value={amount}
                onChange={handleAmountChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TransferInput
                errorMessage={translate('TextVerification.noteInvalid')}
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
            amount === '' || isPaymentNoteInvalid || !amount || amount <= 0
          }
          fullWidth
          onClick={handleConfirmOpen}
        >
          {translate('SendConfirm.buttonSubmitAmount')}
        </Button>
      </Footer>
    </Fragment>
  );
};

export default SendConfirm;
