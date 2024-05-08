import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

import { fontSizeSmaller } from '~/styles/fonts';

const useStyles = makeStyles((theme) => {
  const textColor = (isOrganization) => {
    return isOrganization
      ? theme.custom.colors.purple100
      : theme.custom.colors.purple100;
  };

  const backgroundColor = (isOrganization) => {
    return isOrganization
      ? theme.custom.colors.blue600
      : theme.custom.colors.blue600;
  };

  return {
    inputLabel: {
      transform: 'translate(28px, -6px)',
      background: theme.custom.colors.white,
      fontSize: fontSizeSmaller,
      padding: '2px 6px',
      transition: 'none',
      color: textColor,
      borderRadius: '10px',
      lineHeight: '16px',

      '&.MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: 'translate(28px, -6px)',
      },

      '&.Mui-focused': {
        color: textColor,
      },

      '&.Mui-focused.Mui-error': {
        color: theme.custom.colors.pink100,
      },

      '&:has(+ .MuiOutlinedInput-root:hover)': {
        background: backgroundColor,
      },

      '&:has(+ .MuiOutlinedInput-root.Mui-error:hover)': {
        background: theme.custom.colors.pink500,
      },
    },

    inputLabelError: {
      '&.Mui-error': {
        color: theme.custom.colors.pink100,
      },
    },

    formHelperText: {
      position: 'absolute',
      padding: '2px 6px',
      bottom: '-6px',
      fontSize: fontSizeSmaller,
      right: '30px',
      background: theme.custom.colors.white,
      borderRadius: '10px',
      lineHeight: '16px',
    },

    outlinedInput: {
      padding: '11.5px 14px',
      borderRadius: '25px',
      color: theme.custom.colors.purple100,
    },

    outlinedInputRoot: {
      borderRadius: '25px',
      border: `3px solid transparent`,
      padding: '0px',

      '&:hover': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: textColor,
        },

        '& .MuiOutlinedInput-input': {
          background: backgroundColor,
        },

        '&.Mui-error': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.custom.colors.pink100,
          },

          '& .MuiOutlinedInput-input': {
            background: theme.custom.colors.pink500,
          },
        },

        '& +.MuiFormHelperText-root.Mui-error': {
          background: theme.custom.colors.pink500,
        },
      },

      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: textColor,
        borderWidth: '1px',
      },

      '& +.MuiFormHelperText-root.Mui-error': {
        color: theme.custom.colors.pink100,
      },

      '& .MuiSvgIcon-root': {
        marginLeft: '5px',
      },

      '&.MuiOutlinedInput-multiline': {
        padding: 0,
      },

      '&.Mui-error': {
        '& fieldset.MuiOutlinedInput-notchedOutline': {
          borderColor: theme.custom.colors.pink100,
        },
      },
    },

    outlinedInputFocused: {
      border: (isOrganization) =>
        isOrganization
          ? `3px solid ${theme.custom.colors.purple500} `
          : `3px solid ${theme.custom.colors.blue500}`,
      borderColor: (isOrganization) =>
        isOrganization
          ? theme.custom.colors.purple500
          : theme.custom.colors.blue500,

      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: (isOrganization) =>
          isOrganization
            ? `${theme.custom.colors.purple100} !important`
            : `${theme.custom.colors.blue100} !important`, // should work without important but doesn't...
        borderWidth: '2px',
      },
    },

    outlinedInputError: {
      borderColor: 'transparent',

      '&.Mui-focused': {
        border: `3px solid ${theme.custom.colors.pink500}`,
        borderColor: theme.custom.colors.pink500,

        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: `${theme.custom.colors.pink100} !important`, // should work without important but doesn't...
          borderWidth: '2px',
        },
      },

      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.custom.colors.pink100,
        borderWidth: '2px',
      },
    },
    inputAdornment: {
      padding: '0 5px 0 8px',
    },
  };
});

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
      <FormControl error={isError} fullWidth variant="standard">
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
              <InputAdornment
                classes={{ root: classes.inputAdornment }}
                position="start"
              >
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
            <Typography classes={{ root: 'body6_pink' }} variant="body6">
              {errorMessage}
            </Typography>
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
