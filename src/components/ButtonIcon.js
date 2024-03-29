import { Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

import { iconSelector } from '../styles/icons';

import { fontSizeSmaller, fontWeightRegular } from '~/styles/fonts';

const useStyles = makeStyles((theme) => ({
  button: {
    fontWeight: fontWeightRegular,
    fontSize: fontSizeSmaller,
    color: theme.custom.colors.purple100,
    textTransform: 'none',
    '&:hover': {
      background: 'transparent',
      color: theme.custom.colors.pink100,

      '& path': {
        fill: theme.custom.colors.pink100,
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
