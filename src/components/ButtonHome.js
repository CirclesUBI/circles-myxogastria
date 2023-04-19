import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { DASHBOARD_PATH } from '~/routes';

import { IconClose } from '~/styles/icons';

const ButtonHome = (props) => {
  return (
    <IconButton
      {...props}
      aria-label="Back to home"
      component={Link}
      size="large"
      to={props.to ? null : DASHBOARD_PATH}
    >
      <IconClose />
    </IconButton>
  );
};

ButtonHome.propTypes = {
  to: PropTypes.string,
};

export default ButtonHome;
