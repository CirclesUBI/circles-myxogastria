import { Box, CircularProgress, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import { fontSizeLargest } from '~/styles/fonts';
import {
  IconTrust,
  IconTrustActive,
  IconTrustMutual,
  IconWobblyCircle,
} from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  trustButton: {
    background: 'transparent',
    color: theme.custom.colors.whiteAlmost,
    padding: '0',
  },
  trustButtonNoTrust: {
    '& stop:first-of-type': {
      stopColor: theme.custom.gradients.pinkToPurple,
    },
    '& stop:last-of-type': {
      stopColor: theme.custom.colors.pink100,
    },
    '&:hover': {
      '& stop:first-of-type': {
        stopColor: theme.custom.colors.pinkHoverLight,
      },
      '& stop:last-of-type': {
        stopColor: theme.custom.colors.pink200,
      },
    },
  },
  trustButtonOneWay: {
    '& stop:first-of-type': {
      stopColor: theme.custom.colors.purple100,
    },
    '& stop:last-of-type': {
      stopColor: theme.custom.colors.purple100,
    },
    '&:hover': {
      '& stop:first-of-type': {
        stopColor: theme.custom.colors.purple200,
      },
      '& stop:last-of-type': {
        stopColor: theme.custom.colors.purple200,
      },
    },
  },
  trustButtonMutualTrust: {
    '& stop:first-of-type': {
      stopColor: theme.custom.colors.blue100,
    },
    '& stop:last-of-type': {
      stopColor: theme.custom.colors.blue100,
    },
    '&:hover': {
      '& stop:first-of-type': {
        stopColor: theme.custom.colors.blue200,
      },
      '& stop:last-of-type': {
        stopColor: theme.custom.colors.blue200,
      },
    },
  },
  trustButtonDisabled: {
    '& stop:first-of-type': {
      stopColor: theme.custom.colors.purple500,
    },
    '& stop:last-of-type': {
      stopColor: theme.custom.colors.purple500,
    },
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
          [classes.trustButtonDisabled]: trustStatus.isPending || !isReady,
          [classes.trustButtonNoTrust]:
            !trustStatus.isMeTrusting && !trustStatus.isTrustingMe,
          [classes.trustButtonOneWay]:
            trustStatus.isMeTrusting || trustStatus.isTrustingMe,
          [classes.trustButtonMutualTrust]:
            trustStatus.isMeTrusting && trustStatus.isTrustingMe,
        }),
      }}
      disabled={trustStatus.isPending || !isReady}
      size="large"
      onClick={
        trustStatus.isMeTrusting ? handleRevokeTrustOpen : handleTrustOpen
      }
    >
      <Box className={classes.trustButtonContainer}>
        <IconWobblyCircle className={classes.trustButtonIconBackground} />
        {trustStatus.isPending ? (
          <CircularProgress size={fontSizeLargest} />
        ) : (
          <TrustIcon className={classes.trustButtonIcon} />
        )}
      </Box>
    </IconButton>
  );
};

ButtonTrust.propTypes = {
  className: PropTypes.string,
  handleRevokeTrustOpen: PropTypes.func,
  handleTrustOpen: PropTypes.func,
  isReady: PropTypes.bool,
  trustStatus: PropTypes.object,
};

export default ButtonTrust;
