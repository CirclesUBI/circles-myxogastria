import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import HomeButton from '~/components/HomeButton';
import View from '~/components/View';
import logError from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import resolveUsernames from '~/services/username';
import { BackgroundPurpleTop } from '~/styles/Background';
import { checkCurrentBalance } from '~/store/token/actions';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { untrustUser } from '~/store/trust/actions';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const TrustRevokeConfirm = (props, context) => {
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
      await dispatch(untrustUser(address));

      dispatch(
        notify({
          text: context.t('TrustRevokeConfirm.successMessage', { receiver }),
        }),
      );

      await dispatch(checkCurrentBalance());

      setIsSent(true);
    } catch (error) {
      logError(error);

      dispatch(
        notify({
          text: context.t('TrustRevokeConfirm.errorMessage'),
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
        <BackButton to={`/profile/${address}`} />

        <HeaderCenterStyle>
          <HeaderTitleStyle>
            {context.t('TrustRevokeConfirm.revokeTrust')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <HomeButton />
      </Header>

      <View isFooter isHeader>
        <p>{context.t('TrustRevokeConfirm.confirmationText', { receiver })}</p>
      </View>

      <Footer>
        <ButtonPrimary onClick={onSubmit}>
          {context.t('TrustRevokeConfirm.confirm')}
        </ButtonPrimary>
      </Footer>
    </BackgroundPurpleTop>
  );
};

TrustRevokeConfirm.contextTypes = {
  t: PropTypes.func.isRequired,
};

TrustRevokeConfirm.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(TrustRevokeConfirm);
