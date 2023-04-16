import { FormHelperText, Input, InputLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

const useStyles = makeStyles((theme) => ({
  input: {
    padding: theme.spacing(2),
    height: 66,
    boxShadow: theme.custom.shadows.grayUp,

    '& .MuiSvgIcon-root': {
      fill: theme.custom.colors.grey50,
    },
  },
  inputLabel: {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: 18,
    textAlign: 'left',
  },
  inputError: {
    '&.Mui-error': {
      color: theme.custom.colors.disco,
    },
  },
  inputAmountError: {
    color: theme.custom.colors.disco,
  },
}));

const TransferInput = ({
  className,
  errorMessage,
  id,
  isError = false,
  label,
  ...props
}) => {
  const classes = useStyles();

  return (
    <>
      <InputLabel className={classes.inputLabel} htmlFor={id}>
        {label}
      </InputLabel>
      <Input
        classes={{
          root: classes.input,
          input: className,
          error: classes.inputAmountError,
        }}
        disableUnderline
        error={isError}
        fullWidth
        id={id}
        {...props}
      />
      {isError && (
        <FormHelperText className={classes.inputError} error>
          {errorMessage}
        </FormHelperText>
      )}
    </>
  );
};

TransferInput.propTypes = {
  className: PropTypes.string,
  errorMessage: PropTypes.string,
  id: PropTypes.string.isRequired,
  isError: PropTypes.bool,
  label: PropTypes.string.isRequired,
};

export default TransferInput;
