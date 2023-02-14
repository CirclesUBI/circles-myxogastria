import { Box, CircularProgress, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import {
  IconWobblyCircle,
} from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  button: {
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
  // trustButtonIsMeTrusting: {
  //   '& stop:first-of-type': {
  //     stopColor: theme.custom.colors.violet,
  //   },
  //   '& stop:last-of-type': {
  //     stopColor: theme.custom.colors.violet,
  //   },
  //   '&:hover': {
  //     '& stop:first-of-type': {
  //       stopColor: theme.custom.colors.oldLavender,
  //     },
  //     '& stop:last-of-type': {
  //       stopColor: theme.custom.colors.oldLavender,
  //     },
  //   },
  // },
  // trustButtonMutuallyTrusted: {
  //   '& stop:first-of-type': {
  //     stopColor: theme.custom.colors.fountainBlue,
  //   },
  //   '& stop:last-of-type': {
  //     stopColor: theme.custom.colors.fountainBlue,
  //   },
  //   '&:hover': {
  //     '& stop:first-of-type': {
  //       stopColor: theme.custom.colors.fountainBlueLighter,
  //     },
  //     '& stop:last-of-type': {
  //       stopColor: theme.custom.colors.fountainBlueLighter,
  //     },
  //   },
  // },
  buttonDisabled: {
    background: theme.custom.gradients.gray,
  },
  buttonContainer: {
    width: '55px',
    height: '55px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    position: 'relative',
    left: 1,
    fontSize: '2.4rem',
  },
  buttonIconBackground: {
    width: '55px',
    height: '55px',
    position: 'absolute',
  },
}));

const ButtonWobbly = ({
  icon,
  onClick,
  isReady,
  isPending,
  additionalStyleClasses,
  // trustStatus,
  // handleRevokeTrustOpen,
  // handleTrustOpen,
}) => {
  const classes = useStyles();

  //const Icon = iconComponent;
  // const TrustIcon = trustStatus.isMeTrusting
  //   ? trustStatus.isTrustingMe
  //     ? IconTrustMutual
  //     : IconTrustActive
  //   : IconTrust;


  // otherClasses = {
  //   [classes.trustButtonIsMeTrusting]: trustStatus.isMeTrusting,
  //   [classes.trustButtonIsTrustingMe]: trustStatus.isTrustingMe,
  //   [classes.trustButtonMutuallyTrusted]:
  //     trustStatus.isMeTrusting && trustStatus.isTrustingMe,
  // }
  //const otherClasses = {};
  //const isDisabled = false; // trustStatus.isPending || !isReady 
  //const isPending = false; // trustStatus.isPending
  //const onClick = () => {}; // trustStatus.isMeTrusting ? handleRevokeTrustOpen : handleTrustOpen

  return (
    <IconButton
      classes={{
        root: clsx(classes.button, additionalStyleClasses),
        disabled: classes.buttonDisabled,
      }}
      disabled={isPending || !isReady}
      onClick={onClick}
    >
      {isPending ? (
        <CircularProgress size={24} />
      ) : (
        <Box className={classes.buttonContainer}>
          <IconWobblyCircle className={classes.buttonIconBackground} />
          <TrustIcon className={classes.buttonIcon} />
        </Box>
      )}
    </IconButton>
  );
};

ButtonWobbly.propTypes = {
  additionalStyleClasses: PropTypes.object,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  //handleRevokeTrustOpen: PropTypes.func,
  //handleTrustOpen: PropTypes.func,
  icon: PropTypes.function,
  isReady: PropTypes.bool,
  isPending: PropTypes.bool,
  onClick: PropTypes.function,
  //trustStatus: PropTypes.object,
};

export default ButtonTrust;
