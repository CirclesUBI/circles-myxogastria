import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import HomeButton from '~/components/HomeButton';
import View from '~/components/View';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { BackgroundPurpleTop } from '~/styles/Background';
import { checkCurrentBalance } from '~/store/token/actions';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { resolveUsernames } from '~/services/username';
import { trustUser } from '~/store/trust/actions';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

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
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(trustUser(address));

      dispatch(
        notify({
          text: context.t('TrustConfirm.successMessage', { receiver }),
        }),
      );

      await dispatch(checkCurrentBalance());

      setIsSent(true);
    } catch {
      dispatch(
        notify({
          text: context.t('TrustConfirm.errorMessage'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  useEffect(resolveAddress, [address]);

  if (isSent) {
    return <Redirect to="/" />;
  }

  return (
    <BackgroundPurpleTop>
      <Header>
        <BackButton to="/trust" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>
            {context.t('TrustConfirm.trustSomeone')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <HomeButton />
      </Header>

      <View isFooter isHeader>
        <p>{context.t('TrustConfirm.confirmationText', { receiver })}</p>
      </View>

      <Footer>
        <ButtonPrimary onClick={onSubmit}>
          {context.t('TrustConfirm.confirm')}
        </ButtonPrimary>
      </Footer>
    </BackgroundPurpleTop>
  );
};

TrustConfirm.contextTypes = {
  t: PropTypes.func.isRequired,
};

TrustConfirm.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(TrustConfirm);
