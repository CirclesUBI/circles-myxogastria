import PropTypes from 'prop-types';
import React from 'react';
import { Avatar as MuiAvatar } from '@material-ui/core';

const Avatar = () => {
  return <MuiAvatar />;
};

Avatar.propTypes = {
  address: PropTypes.string.isRequired,
};

export default Avatar;
