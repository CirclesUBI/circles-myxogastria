import { FormControl, TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  dateInput: {
    '& fieldset.MuiOutlinedInput-notchedOutline': {
      borderRadius: '25px',
      borderColor: theme.custom.colors.violet,
      '& legend span': {
        display: 'none',
      },
    },

    '& input.MuiInputBase-input': {
      padding: '11.5px 14px',
      color: theme.custom.colors.violet,
    },

    '& label.MuiFormLabel-root': {
      color: theme.custom.colors.violet,
      fontSize: '12px',
      transform: 'translate(28px, -6px)',
      background: theme.custom.colors.white,
      transition: 'none',
      padding: '2px 6px',
      lineHeight: '16px',
      borderRadius: '10px',
    },

    '& .MuiInputBase-root': {
      '& input.MuiInputBase-input': {
        borderRadius: '25px',
      },

      '&:hover': {
        '& input.MuiInputBase-input': {
          background: theme.custom.colors.cornflowerBlue,
        },
      },
    },

    '&:hover': {
      '& fieldset.MuiOutlinedInput-notchedOutline': {},
      '& label.MuiFormLabel-root': {
        background: theme.custom.colors.cornflowerBlue,
      },
    },

    '& .MuiInputBase-root.MuiOutlinedInput-root': {
      borderRadius: '25px',
      border: `3px solid transparent`,
    },

    '& .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused': {
      border: `3px solid ${theme.custom.colors.lola}`,

      '& fieldset.MuiOutlinedInput-notchedOutline': {
        borderColor: theme.custom.colors.violet,
      },

      '& label.MuiFormLabel-root': {
        background: theme.custom.colors.lola,
      },
    },
    '& button.MuiButtonBase-root.MuiIconButton-root': {
      right: '2px',

      '&:hover': {
        background: theme.custom.colors.cornflowerBlue,
      },
    },
  },
}));

const DateInput = ({ ...props }) => {
  const classes = useStyles();

  return (
    <FormControl variant="standard">
      <TextField
        {...props}
        classes={{
          root: classes.dateInput,
        }}
      />
    </FormControl>
  );
};

export default DateInput;
