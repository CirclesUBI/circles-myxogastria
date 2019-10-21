import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

import ProfileBox from '~/components/ProfileBox';
import Header from '~/components/Header';
import HomeButton from '~/components/HomeButton';
import View from '~/components/View';
import { BackgroundPurple } from '~/styles/Background';

const Profile = props => {
  const { address } = props.match.params;

  return (
    <BackgroundPurple>
      <Header isAlignedRight>
        <HomeButton />
      </Header>

      <View isHeader>
        <ProfileBox address={address} />
      </View>
    </BackgroundPurple>
  );
};

Profile.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(Profile);
