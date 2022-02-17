import { FormHelperText, Input, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

const useStyles = makeStyles((theme) => ({
  input: {
    padding: theme.spacing(2),
    height: 66,
    boxShadow: theme.custom.shadows.grayUp,
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
    <Fragment>
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
    </Fragment>
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
