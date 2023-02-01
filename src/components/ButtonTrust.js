import { Box, CircularProgress, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import {
  IconTrust,
  IconTrustActive,
  IconTrustCustomShape,
  IconTrustMutual,
} from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  trustButton: {
    background: 'transparent',
    color: theme.palette.common.whiteAlmost,
    padding: '0',
    '& stop:first-of-type': {
      stopColor: theme.custom.colors.purpleDark,
    },
    '& stop:last-of-type': {
      stopColor: theme.custom.colors.purple,
    },
    '&:hover': {
      '& stop:first-of-type': {
        stopColor: theme.custom.colors.cannonPink,
      },
      '& stop:last-of-type': {
        stopColor: theme.custom.colors.cranberry,
      },
    },
  },
  trustButtonIsMeTrusting: {
    '& stop:first-of-type': {
      stopColor: theme.custom.colors.violet,
    },
    '& stop:last-of-type': {
      stopColor: theme.custom.colors.violet,
    },
    '&:hover': {
      '& stop:first-of-type': {
        stopColor: theme.custom.colors.oldLavender,
      },
      '& stop:last-of-type': {
        stopColor: theme.custom.colors.oldLavender,
      },
    },
  },
  trustButtonMutuallyTrusted: {
    '& stop:first-of-type': {
      stopColor: theme.custom.colors.fountainBlue,
    },
    '& stop:last-of-type': {
      stopColor: theme.custom.colors.fountainBlue,
    },
    '&:hover': {
      '& stop:first-of-type': {
        stopColor: theme.custom.colors.fountainBlueLighter,
      },
      '& stop:last-of-type': {
        stopColor: theme.custom.colors.fountainBlueLighter,
      },
    },
  },
  trustButtonDisabled: {
    background: theme.custom.gradients.gray,
  },
  trustButtonContainer: {
    width: '55px',
    height: '55px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustButtonIcon: {
    position: 'relative',
    left: 1,
    fontSize: '2.4rem',
  },
  trustButtonIconBackground: {
    width: '55px',
    height: '55px',
    position: 'absolute',
  },
}));

const ButtonTrust = ({
  isReady,
  trustStatus,
  handleRevokeTrustOpen,
  handleTrustOpen,
}) => {
  const classes = useStyles();

  const TrustIcon = trustStatus.isMeTrusting
    ? trustStatus.isTrustingMe
      ? IconTrustMutual
      : IconTrustActive
    : IconTrust;

  return (
    <IconButton
      classes={{
        root: clsx(classes.trustButton, {
          [classes.trustButtonIsMeTrusting]: trustStatus.isMeTrusting,
          [classes.trustButtonIsTrustingMe]: trustStatus.isTrustingMe,
          [classes.trustButtonMutuallyTrusted]:
            trustStatus.isMeTrusting && trustStatus.isTrustingMe,
        }),
        disabled: classes.trustButtonDisabled,
      }}
      disabled={trustStatus.isPending || !isReady}
      onClick={
        trustStatus.isMeTrusting ? handleRevokeTrustOpen : handleTrustOpen
      }
    >
      {trustStatus.isPending ? (
        <CircularProgress size={24} />
      ) : (
        <Box className={classes.trustButtonContainer}>
          <IconTrustCustomShape className={classes.trustButtonIconBackground} />
          <TrustIcon className={classes.trustButtonIcon} />
        </Box>
      )}
    </IconButton>
  );
};

ButtonTrust.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  handleRevokeTrustOpen: PropTypes.func,
  handleTrustOpen: PropTypes.func,
  isReady: PropTypes.bool,
  trustStatus: PropTypes.object,
};

export default ButtonTrust;
