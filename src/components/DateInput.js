import { FormControl, TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';

import { fontSizeSmaller } from '~/styles/fonts';

const useStyles = makeStyles((theme) => ({
  dateInput: {
    '& fieldset': {
      '&.MuiOutlinedInput-notchedOutline': {
        borderRadius: '25px',
        borderColor: theme.custom.colors.violet,
        '& legend span': {
          display: 'none',
        },
      },
    },

    '& input.MuiInputBase-input': {
      padding: '11.5px 14px',
      color: theme.custom.colors.violet,
    },

    '& label.MuiFormLabel-root': {
      color: theme.custom.colors.violet,
      fontSize: fontSizeSmaller,
      transform: 'translate(28px, -6px)',
      background: theme.custom.colors.white,
      transition: 'none',
      padding: '2px 6px',
      lineHeight: '16px',
      borderRadius: '10px',

      '&:has(+ .MuiOutlinedInput-root:hover)': {
        background: theme.custom.colors.cornflowerBlue,
      },

      '&.Mui-error': {
        color: theme.custom.colors.purple,

        '&:has(+ .MuiOutlinedInput-root:hover)': {
          background: theme.custom.colors.wepeep,
        },

        '&:hover': {
          background: theme.custom.colors.white,
        },
      },
    },

    '& .MuiInputBase-root': {
      paddingRight: 0,

      '& input.MuiInputBase-input': {
        borderRadius: '25px',
      },

      '&:hover': {
        '& input.MuiInputBase-input': {
          background: theme.custom.colors.cornflowerBlue,
        },
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
    '& .Mui-error': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.custom.colors.purple,
        borderWidth: '2px',
      },

      '& button.MuiButtonBase-root.MuiIconButton-root': {
        '&:hover': {
          background: theme.custom.colors.wepeep,
        },
      },

      '&.MuiInputBase-root': {
        '&:hover': {
          '& input.MuiInputBase-input': {
            background: theme.custom.colors.wepeep,
          },

          '& +.MuiFormHelperText-root.Mui-error': {
            background: theme.custom.colors.wepeep,
          },
        },

        '&.MuiOutlinedInput-root.Mui-focused': {
          border: `3px solid ${theme.custom.colors.wepeep}`,

          '& fieldset.MuiOutlinedInput-notchedOutline': {
            borderColor: theme.custom.colors.purple,
          },

          '& label.MuiFormLabel-root': {
            background: theme.custom.colors.wepeep,
          },
        },
      },
      '&.MuiFormHelperText-root': {
        right: '0',
        bottom: '-2px',
        padding: '2px 6px',
        position: 'absolute',
        fontSize: fontSizeSmaller,
        background: theme.custom.colors.white,
        lineHeight: '10px',
        borderRadius: '10px',
        color: theme.custom.colors.purple,
      },
    },

    '& .MuiInputAdornment-root': {
      position: 'absolute',
      right: '14px',

      '& .MuiButtonBase-root.MuiIconButton-root': {
        '&:hover': {
          background: 'none',
        },
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
