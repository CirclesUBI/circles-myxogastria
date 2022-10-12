import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  inputLabel: {
    transform: 'translate(28px, -6px)',
    background: theme.custom.colors.white,
    fontSize: '12px',
    padding: '2px 6px',
    transition: 'none',
    color: (isOrganization) =>
      isOrganization
        ? theme.custom.colors.violet
        : theme.custom.colors.fountainBlue,
    borderRadius: '10px',
    lineHeight: '16px',

    '&.MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(28px, -6px)',
    },

    '&.Mui-focused': {
      color: (isOrganization) =>
        isOrganization
          ? theme.custom.colors.violet
          : theme.custom.colors.fountainBlue,
    },

    '&.Mui-focused.Mui-error': {
      color: theme.custom.colors.purple,
    },

    '&:has(+ .MuiOutlinedInput-root:hover)': {
      background: (isOrganization) =>
        isOrganization
          ? theme.custom.colors.cornflowerBlue
          : theme.custom.colors.blackSqueeze,
    },

    '&:has(+ .MuiOutlinedInput-root.Mui-error:hover)': {
      background: theme.custom.colors.wepeep,
    },
  },

  inputLabelError: {
    color: theme.custom.colors.purple,
  },

  inputLabelClasses: {
    background: 'white',
    padding: '0 10px',
  },

  formHelperText: {
    position: 'absolute',
    padding: '2px 6px',
    bottom: '-6px',
    fontSize: '12px',
    right: '30px',
    background: theme.custom.colors.white,
    borderRadius: '10px',
    lineHeight: '16px',
  },

  outlinedInput: {
    padding: '13.5px 14px',
    borderRadius: '25px',
    color: theme.custom.colors.violet,
  },

  outlinedInputRoot: {
    borderRadius: '25px',
    border: `3px solid transparent`,

    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: (isOrganization) =>
        isOrganization
          ? theme.custom.colors.violet
          : theme.custom.colors.fountainBlue,
      borderWidth: '1px',
    },

    '&:hover': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: (isOrganization) =>
          isOrganization
            ? theme.custom.colors.violet
            : theme.custom.colors.fountainBlue,
      },

      '& .MuiOutlinedInput-input': {
        background: (isOrganization) =>
          isOrganization
            ? theme.custom.colors.cornflowerBlue
            : theme.custom.colors.blackSqueeze,
      },

      '&.Mui-error': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.custom.colors.purple,
        },

        '& .MuiOutlinedInput-input': {
          background: theme.custom.colors.wepeep,
        },
      },

      '& +.MuiFormHelperText-root.Mui-error': {
        background: theme.custom.colors.wepeep,
      },
    },

    '& .MuiSvgIcon-root': {
      marginLeft: '5px',
    },

    '&.MuiOutlinedInput-multiline': {
      padding: 0,
    },
  },

  outlinedInputFocused: {
    border: (isOrganization) =>
      isOrganization
        ? `3px solid ${theme.custom.colors.lola} `
        : `3px solid ${theme.custom.colors.swansDown}`,
    borderColor: (isOrganization) =>
      isOrganization ? theme.custom.colors.lola : theme.custom.colors.swansDown,

    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: (isOrganization) =>
        isOrganization
          ? `${theme.custom.colors.violet} !important`
          : `${theme.custom.colors.fountainBlue} !important`, // should work without important but doesn't...
      borderWidth: '2px',
    },
  },

  outlinedInputError: {
    borderColor: theme.custom.colors.wepeep,

    '&.Mui-focused': {
      border: `3px solid ${theme.custom.colors.wepeep}`,
      borderColor: theme.custom.colors.wepeep,

      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: `${theme.custom.colors.purple} !important`, // should work without important but doesn't...
        borderWidth: '2px',
      },
    },

    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.custom.colors.purple,
      borderWidth: '2px',
    },
  },
}));

const Input = ({
  isError,
  id,
  errorMessage,
  label,
  isLoading,
  isOrganization = false,
  value,
  ...props
}) => {
  const classes = useStyles(isOrganization);

  return (
    <>
      <FormControl error={isError} fullWidth>
        {label && (
          <InputLabel
            classes={{
              root: classes.inputLabel,
              error: classes.inputLabelError,
            }}
            htmlFor={id}
            variant="outlined"
          >
            {label}
          </InputLabel>
        )}
        <OutlinedInput
          autoComplete="off"
          classes={{
            input: classes.outlinedInput,
            root: classes.outlinedInputRoot,
            focused: classes.outlinedInputFocused,
            error: classes.outlinedInputError,
          }}
          endAdornment={
            isLoading ? (
              <InputAdornment position="end">
                <CircularProgress size={15} />
              </InputAdornment>
            ) : null
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
    </>
  );
};

Input.propTypes = {
  errorMessage: PropTypes.string,
  id: PropTypes.string.isRequired,
  isError: PropTypes.bool,
  isLoading: PropTypes.bool,
  isOrganization: PropTypes.bool,
  isShowingCheck: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.any.isRequired,
};

export default Input;
