import { ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import Button from '~/components/Button';
// import translate from '~/services/locale';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    marginTop: '30px',
    marginBottom: '70px',
    padding: '0 16px',
    '& a:first-of-type': {
      border: 0,
      marginRight: '4px',
      padding: '6px 15px',
      '&.Mui-disabled': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
    '& a:nth-of-type(2)': {
      borderLeftStyle: 'none',
      marginLeft: '4px',
      padding: '6px 15px',
      border: 0,
      '&.Mui-disabled': {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
      },
    },
  },

  buttonGradientOpposite: {
    background: theme.custom.gradients.purpleOpposite,
    '&:hover': {
      background: theme.custom.gradients.purpleOppositeHover,
    },
  },
}));

const ButtonDouble = ({
  leftBtnText,
  leftBtnPath,
  rightBtnText,
  rightBtnPath,
}) => {
  const classes = useStyles();

  return (
    <ButtonGroup className={classes.buttonContainer} fullWidth>
      <Button to={leftBtnPath}>{leftBtnText}</Button>
      <Button className={classes.buttonGradientOpposite} to={rightBtnPath}>
        {rightBtnText}
      </Button>
    </ButtonGroup>
  );
};

ButtonDouble.propTypes = {
  leftBtnPath: PropTypes.string.isRequired,
  leftBtnText: PropTypes.string.isRequired,
  rightBtnPath: PropTypes.string.isRequired,
  rightBtnText: PropTypes.string.isRequired,
};

export default ButtonDouble;
