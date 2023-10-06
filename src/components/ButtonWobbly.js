import { Box, CircularProgress, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import { fontSizeLargest } from '~/styles/fonts';
import { IconWobblyCircle, iconSelector } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  buttonWobbly: {
    background: 'transparent',
    color: theme.palette.common.whiteAlmost,
    padding: '0',
    '& stop:first-of-type': {
      stopColor: theme.custom.gradients.pinkToPurple,
    },
    '& stop:last-of-type': {
      stopColor: theme.custom.colors.pink100,
    },
    '&:hover': {
      '& stop:first-of-type': {
        stopColor: theme.custom.colors.cannonPink,
      },
      '& stop:last-of-type': {
        stopColor: theme.custom.colors.pink200,
      },
    },
  },
  buttonWobblyDisabled: {
    background: theme.custom.gradients.gray,
  },
  buttonWobblyContainer: {
    width: '55px',
    height: '55px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWobblyIcon: {
    position: 'relative',
    left: 1,
    fontSize: '2.4rem',
    color: theme.custom.colors.whiteAlmost,
  },
  buttonWobblyIconBackground: {
    width: '55px',
    height: '55px',
    position: 'absolute',
  },
}));

const ButtonWobbly = ({
  additionalStyleClasses,
  icon,
  isReady,
  isPending,
  onClick,
}) => {
  const classes = useStyles();
  const IconElement = iconSelector(icon);

  return (
    <IconButton
      classes={{
        root: clsx(classes.wobblyButton, additionalStyleClasses),
        disabled: classes.buttonWobblyDisabled,
      }}
      disabled={isPending || !isReady}
      onClick={onClick}
    >
      {isPending ? (
        <CircularProgress size={fontSizeLargest} />
      ) : (
        <Box className={classes.buttonContainer}>
          <IconWobblyCircle className={classes.buttonWobblyIconBackground} />
          <IconElement className={classes.buttonWobblyIcon} />
        </Box>
      )}
    </IconButton>
  );
};

ButtonWobbly.propTypes = {
  additionalStyleClasses: PropTypes.object,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  icon: PropTypes.function,
  isPending: PropTypes.bool,
  isReady: PropTypes.bool,
  onClick: PropTypes.function,
  to: PropTypes.string,
};

export default ButtonWobbly;
