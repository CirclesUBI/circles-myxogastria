import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

import Header from '~/components/Header';
import HomeButton from '~/components/HomeButton';
import ProfileBox from '~/components/ProfileBox';
import View from '~/components/View';
import { BackgroundPurplePlain } from '~/styles/Background';

const Profile = props => {
  const { address } = props.match.params;

  return (
    <BackgroundPurplePlain>
      <Header isAlignedRight>
        <HomeButton />
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

export default withRouter(Profile);
