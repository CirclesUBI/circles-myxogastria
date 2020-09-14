import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Bubble from '~/components/Bubble';
import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import Button from '~/components/Button';
import Footer from '~/components/Footer';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import logError from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { untrustUser } from '~/store/trust/actions';

import Header from '~/components/Header';

const TrustRevokeConfirm = (props) => {
  const { address } = props.match.params;
  const [isSent, setIsSent] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = async () => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(untrustUser(address));

      dispatch(
        notify({
          text: translate('TrustRevokeConfirm.successMessage'),
        }),
      );

      setIsSent(true);
    } catch (error) {
      logError(error);

      dispatch(
        notify({
          text: translate('TrustRevokeConfirm.errorMessage'),
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
        <ButtonBack to={`/profile/${address}`} />
        {translate('TrustRevokeConfirm.revokeTrust')}
        <ButtonHome />
      </Header>

      <View>
        <Bubble>
          <p>
            {translate('TrustRevokeConfirm.confirmationText')}
            <UsernameDisplay address={address} />
            {translate('TrustRevokeConfirm.confirmationTextAfter')}
          </p>
        </Bubble>
      </View>

      <Footer>
        <Button onClick={onSubmit}>
          {translate('TrustRevokeConfirm.confirm')}
        </Button>
      </Footer>
    </Fragment>
  );
};

TrustRevokeConfirm.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(TrustRevokeConfirm);
