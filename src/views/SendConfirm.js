import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
import Header from '~/components/Header';
import View from '~/components/View';
import logError from '~/services/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { resolveUsernames } from '~/services/username';
import { sendCircles } from '~/store/token/actions';

const SendConfirm = (props, context) => {
  const { address } = props.match.params;

  const [amount, setAmount] = useState(0);
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [receiver, setReceiver] = useState(address);

  const dispatch = useDispatch();

  const resolveAddress = safeAddress => {
    resolveUsernames([safeAddress]).then(result => {
      if (safeAddress in result) {
        setReceiver(result[safeAddress]);
      }
    });
  };

  const onAmountChange = event => {
    setAmount(event.target.value);
  };

  const onNext = () => {
    setIsConfirmationShown(true);
  };

  const onSubmit = async () => {
    try {
      await dispatch(sendCircles(address, amount));

      dispatch(
        notify({
          text: context.t('SendConfirm.successMessage'),
        }),
      );

      setIsSent(true);
    } catch (error) {
      logError(error);

      dispatch(
        notify({
          text: context.t('SendConfirm.errorMessage'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  };

  useEffect(resolveAddress, [address]);

  if (isSent) {
    return <Redirect to="/" />;
  }

  if (isConfirmationShown) {
    return (
      <SendConfirmView>
        <p>{context.t('SendConfirm.confirmationText', { receiver, amount })}</p>

        <ButtonPrimary onClick={onSubmit}>
          {context.t('SendConfirm.confirm')}
        </ButtonPrimary>
      </SendConfirmView>
    );
  }

  return (
    <SendConfirmView>
      <p>{context.t('SendConfirm.howMuch')}</p>

      <input type="number" value={amount} onChange={onAmountChange} />

      <ButtonPrimary disabled={!amount > 0} onClick={onNext}>
        {context.t('SendConfirm.submitAmount')}
      </ButtonPrimary>
    </SendConfirmView>
  );
};

const SendConfirmView = props => {
  return (
    <Fragment>
      <Header>
        <BackButton to="/send" />
      </Header>

      <View isHeader>{props.children}</View>
    </Fragment>
  );
};

SendConfirm.contextTypes = {
  t: PropTypes.func.isRequired,
};

SendConfirm.propTypes = {
  match: PropTypes.object.isRequired,
};

SendConfirmView.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withRouter(SendConfirm);
