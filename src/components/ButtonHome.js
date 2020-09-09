import PropTypes from 'prop-types';
import React from 'react';
import { IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { IconClose } from '~/styles/icons';

const ButtonHome = (props) => {
  return (
    <IconButton
      {...props}
      aria-label="menu"
      component={Link}
      to={props.onClick ? null : '/'}
    >
      <IconClose />
    </IconButton>
  );
};

ButtonHome.propTypes = {
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default ButtonHome;
