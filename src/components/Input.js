import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  Input as MuiInput,
  InputAdornment,
  InputLabel,
} from '@material-ui/core';

import { IconCheck } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  inputLabel: {
    '&.Mui-focused': {
      color: theme.palette.text.primary,
    },
    '&.Mui-error': {
      color: theme.custom.colors.red,
    },
  },
  inputUnderline: {
    '&.Mui-focused::after': {
      borderBottomColor: theme.palette.text.primary,
    },
    '&.Mui-error::after': {
      borderBottomColor: theme.custom.colors.red,
    },
  },
  formHelperText: {
    '&.Mui-error': {
      color: theme.custom.colors.red,
    },
  },
}));

const Input = ({
  isError,
  id,
  errorMessage,
  label,
  isLoading,
  isShowingCheck = true,
  value,
  ...props
}) => {
  const classes = useStyles();

  return (
    <FormControl error={isError} fullWidth>
      {label && (
        <InputLabel className={classes.inputLabel} htmlFor={id}>
          {label}
        </InputLabel>
      )}
      <MuiInput
        autoComplete="off"
        classes={{
          underline: classes.inputUnderline,
        }}
        endAdornment={
          isLoading ? (
            <InputAdornment position="end">
              <CircularProgress size={15} />
            </InputAdornment>
          ) : (
            !isError &&
            value.length > 0 &&
            isShowingCheck && <IconCheck color="secondary" fontSize="small" />
          )
        }
        id={id}
        value={value}
        {...props}
      />
      {isError && errorMessage && (
        <FormHelperText className={classes.formHelperText}>
          {errorMessage}
        </FormHelperText>
      )}
    </FormControl>
  );
};

Input.propTypes = {
  errorMessage: PropTypes.string,
  id: PropTypes.string.isRequired,
  isError: PropTypes.bool,
  isLoading: PropTypes.bool,
  isShowingCheck: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.any.isRequired,
};

export default Input;
