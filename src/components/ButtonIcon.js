import { Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

import { iconSelector } from '../styles/icons';

const useStyles = makeStyles((theme) => ({
  button: {
    fontWeight: '400',
    fontSize: '12px',
    color: theme.custom.colors.violet,
    textTransform: 'none',
    '&:hover': {
      background: 'transparent',
      color: theme.custom.colors.purple,

      '& path': {
        fill: theme.custom.colors.purple,
      },
    },
  },
}));

const ButtonIcon = ({ onClick, icon, children, props }) => {
  const IconElement = iconSelector(icon);
  const classes = useStyles();

  return (
    <Button
      classes={{ root: classes.button }}
      endIcon={<IconElement />}
      variant="text"
      {...props}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

ButtonIcon.propTypes = {
  children: PropTypes.any.isRequired,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  props: PropTypes.object,
};

export default ButtonIcon;
