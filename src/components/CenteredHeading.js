import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import Centered from '~/components/Centered';

const CenteredHeading = ({ children }) => {
  return (
    <Centered>
      <Typography align="center" component="h1" noWrap variant="h2">
        {children}
      </Typography>
    </Centered>
  );
};

CenteredHeading.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CenteredHeading;
