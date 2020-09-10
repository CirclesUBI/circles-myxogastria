import React from 'react';
import { Select, MenuItem, InputBase } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import translate, { setLocale, currentLocale } from '~/services/locale';
import { LOCALES } from 'locales';

const useStyles = makeStyles((theme) => ({
  select: {
    color: theme.palette.primary.contrastText,
  },
  selectIcon: {
    fill: theme.palette.primary.contrastText,
  },
}));

const LocaleSelector = () => {
  const classes = useStyles();

  const onSelect = (event) => {
    setLocale(event.target.value);
    window.location.reload();
  };

  return (
    <Select
      classes={{ root: classes.select, icon: classes.selectIcon }}
      input={<LocaleSelectorInput />}
      value={currentLocale}
      variant="outlined"
      onChange={onSelect}
    >
      {LOCALES.map((locale) => {
        return (
          <MenuItem key={locale} value={locale}>
            {translate(`LocaleSelector.${locale}`)}
          </MenuItem>
        );
      })}
    </Select>
  );
};

const LocaleSelectorInput = withStyles((theme) => ({
  input: {
    padding: theme.spacing(1),
    backgroundColor: 'transparent',
    borderRadius: 5,
    border: `1px solid ${theme.palette.primary.contrastText}`,
    fontSize: 14,
    '&:focus': {
      borderRadius: 5,
    },
  },
}))(InputBase);

export default LocaleSelector;
