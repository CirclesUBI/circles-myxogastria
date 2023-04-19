import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { IconClose } from '~/styles/icons';

const ButtonClose = ({ onClick, props }) => {
  return (
    <IconButton
      {...props}
      align="center"
      aria-label="Close"
      size="large"
      onClick={onClick}
    >
      <IconClose />
    </IconButton>
  );
};

ButtonClose.propTypes = {
  onClick: PropTypes.func,
  props: PropTypes.object,
};

export default ButtonClose;
