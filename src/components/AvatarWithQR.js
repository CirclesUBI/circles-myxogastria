import PropTypes from 'prop-types';
import React from 'react';

import Avatar from '~/components/Avatar';

const AvatarWithQR = () => {
  return <Avatar address="0x" />;
};

AvatarWithQR.propTypes = {
  address: PropTypes.string,
};

export default AvatarWithQR;
