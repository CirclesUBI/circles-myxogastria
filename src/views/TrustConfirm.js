import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';
import Header from '~/components/Header';
import View from '~/components/View';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { resolveUsernames } from '~/services/username';
import { trustUser } from '~/store/trust/actions';

const TrustConfirm = (props, context) => {
  const { address } = props.match.params;

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

  const onSubmit = async () => {
    try {
      await dispatch(trustUser(address));

      dispatch(
        notify({
          text: context.t('TrustConfirm.successMessage', { receiver }),
        }),
      );

      setIsSent(true);
    } catch {
      dispatch(
        notify({
          text: context.t('TrustConfirm.errorMessage'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  };

  useEffect(resolveAddress, [address]);

  if (isSent) {
    return <Redirect to="/" />;
  }

  return (
    <Fragment>
      <Header>
        <BackButton to="/trust" />
      </Header>

      <View>
        <p>{context.t('TrustConfirm.confirmationText', { receiver })}</p>

        <Button onClick={onSubmit}>{context.t('TrustConfirm.confirm')}</Button>
      </View>
    </Fragment>
  );
};

TrustConfirm.contextTypes = {
  t: PropTypes.func.isRequired,
};

TrustConfirm.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(TrustConfirm);
