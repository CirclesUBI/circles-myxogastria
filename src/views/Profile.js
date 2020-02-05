import PropTypes from 'prop-types';
import React from 'react';
import web3 from '~/services/web3';
import { Redirect, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ButtonHome from '~/components/ButtonHome';
import Header from '~/components/Header';
import ProfileBox from '~/components/ProfileBox';
import View from '~/components/View';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { BackgroundPurplePlain } from '~/styles/Background';

const Profile = (props, context) => {
  const dispatch = useDispatch();
  const { address } = props.match.params;

  if (!web3.utils.checkAddressChecksum(address)) {
    dispatch(
      notify({
        text: context.t('Profile.invalidAddress'),
        type: NotificationsTypes.WARNING,
      }),
    );

    return <Redirect to="/" />;
  }

  return (
    <BackgroundPurplePlain>
      <Header isAlignedRight>
        <ButtonHome />
      </Header>

      <View isHeader>
        <ProfileBox address={address} />
      </View>
    </BackgroundPurplePlain>
  );
};

Profile.propTypes = {
  match: PropTypes.object.isRequired,
};

Profile.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default withRouter(Profile);
