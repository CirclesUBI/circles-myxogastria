import { FormHelperText, Input, InputLabel, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

const useStyles = makeStyles((theme) => ({
  input: {
    padding: theme.spacing(2),
    height: 66,
    boxShadow: theme.custom.shadows.grayUp,
    color: theme.custom.colors.purple100,

    '& .MuiSvgIcon-root': {
      fill: theme.custom.colors.purple100,
    },
  },
  inputLabel: {
    marginBottom: theme.spacing(1),
    textAlign: 'left',
  },
  inputError: {
    '&.Mui-error': {
      color: theme.custom.colors.pink50,
    },
  },
  inputAmountError: {
    color: theme.custom.colors.pink50,
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
        <Typography variant="h4">{label}</Typography>
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
          <Typography classes={{ root: 'body6_pink' }} variant="body6">
            {errorMessage}
          </Typography>
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
