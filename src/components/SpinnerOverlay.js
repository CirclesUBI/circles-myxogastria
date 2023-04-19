import { Backdrop, CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

import { colors } from '~/styles/theme';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.spinnerOverlay,
    backgroundColor: colors.white,
  },
}));

const SpinnerOverlay = (props) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={props.isVisible}>
      <CircularProgress />
    </Backdrop>
  );
};

SpinnerOverlay.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default SpinnerOverlay;
