import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Bubble from '~/components/Bubble';
import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import logError from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { trustUser } from '~/store/trust/actions';

const TrustConfirm = (props) => {
  const { address } = props.match.params;
  const [isSent, setIsSent] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async () => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(trustUser(address));

      dispatch(
        notify({
          text: translate('TrustConfirm.successMessage'),
        }),
      );

      setIsSent(true);
    } catch (error) {
      logError(error);

      dispatch(
        notify({
          text: translate('TrustConfirm.errorMessage'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  if (isSent) {
    return <Redirect to="/" />;
  }

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/trust" />
        {translate('TrustConfirm.trustSomeone')}
        <ButtonHome />
      </Header>

      <View>
        <Bubble>
          <p>
            {translate('TrustConfirm.confirmationText')}
            <UsernameDisplay address={address} />
            {translate('TrustConfirm.confirmationTextAfter')}
          </p>
        </Bubble>
      </View>

      <Footer>
        <ButtonPrimary onClick={onSubmit}>
          {translate('TrustConfirm.confirm')}
        </ButtonPrimary>
      </Footer>
    </Fragment>
  );
};

TrustConfirm.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(TrustConfirm);
