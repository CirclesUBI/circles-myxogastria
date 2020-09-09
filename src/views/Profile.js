import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import web3 from '~/services/web3';
import { Redirect, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ButtonHome from '~/components/ButtonHome';
import Header from '~/components/Header';
import ProfileBox from '~/components/ProfileBox';
import View from '~/components/View';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';

const Profile = (props) => {
  const dispatch = useDispatch();
  const { address } = props.match.params;

  if (!web3.utils.checkAddressChecksum(address)) {
    dispatch(
      notify({
        text: translate('Profile.invalidAddress'),
        type: NotificationsTypes.WARNING,
      }),
    );

    return <Redirect to="/" />;
  }

  return (
    <Fragment>
      <Header>
        <ButtonHome />
      </Header>

      <View>
        <ProfileBox address={address} />
      </View>
    </Fragment>
  );
};

Profile.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(Profile);
