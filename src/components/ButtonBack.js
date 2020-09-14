import PropTypes from 'prop-types';
import React from 'react';
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { IconBack } from '~/styles/icons';

const ButtonBack = (props) => {
  return (
    <IconButton {...props} aria-label="Return" component={Link}>
      <IconBack />
    </IconButton>
  );
};

ButtonBack.propTypes = {
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default ButtonBack;
