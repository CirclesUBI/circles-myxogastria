import PropTypes from 'prop-types';
import React from 'react';
import { Typography } from '@material-ui/core';

import Centered from '~/components/Centered';

const CenteredHeading = ({ children }) => {
  return (
    <Centered>
      <Typography align="center" component="h1" noWrap variant="h6">
        {children}
      </Typography>
    </Centered>
  );
};

CenteredHeading.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CenteredHeading;
