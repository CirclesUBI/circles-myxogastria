import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';
import Header from '~/components/Header';
import View from '~/components/View';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { resolveUsernames } from '~/services/username';
import { sendCircles } from '~/store/token/actions';

const SendAmount = (props, context) => {
  const { address } = props.match.params;

  const [amount, setAmount] = useState(0);
  const [receiver, setReceiver] = useState(address);
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);

  const dispatch = useDispatch();

  const resolveAddress = safeAddress => {
    resolveUsernames([safeAddress]).then(result => {
      setReceiver(result[safeAddress]);
    });
  };

  const onAmountChange = event => {
    setAmount(event.target.value);
  };

  const onNext = () => {
    setIsConfirmationShown(true);
  };

  const onSubmit = () => {
    try {
      dispatch(sendCircles(amount));

      dispatch(
        notify({
          text: context.t('SendAmount.successMessage'),
        }),
      );
    } catch {
      dispatch(
        notify({
          text: context.t('SendAmount.errorMessage'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  };

  useEffect(resolveAddress, [address]);

  if (isConfirmationShown) {
    return (
      <SendAmountView>
        <p>{context.t('SendAmount.confirmationText', { receiver, amount })}</p>

        <Button onClick={onSubmit}>{context.t('SendAmount.confirm')}</Button>
      </SendAmountView>
    );
  }

  return (
    <SendAmountView>
      <input type="number" value={amount} onChange={onAmountChange} />

      <Button disabled={amount === 0} onClick={onNext}>
        {context.t('SendAmount.submitAmount')}
      </Button>
    </SendAmountView>
  );
};

const SendAmountView = props => {
  return (
    <Fragment>
      <Header>
        <BackButton to="/send" />
      </Header>

      <View>{props.children}</View>
    </Fragment>
  );
};

SendAmount.contextTypes = {
  t: PropTypes.func.isRequired,
};

SendAmount.propTypes = {
  match: PropTypes.object.isRequired,
};

SendAmountView.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withRouter(SendAmount);
