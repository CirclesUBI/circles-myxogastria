import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardHeader } from '@material-ui/core';

import Avatar from '~/components/Avatar';
import { useUserdata } from '~/hooks/username';

const ProfileMini = ({ address, ...props }) => {
  const { username } = useUserdata(address);

  return (
    <Card {...props}>
      <CardHeader avatar={<Avatar address={address} />} title={username} />
    </Card>
  );
};

ProfileMini.propTypes = {
  address: PropTypes.string.isRequired,
};

export default ProfileMini;
