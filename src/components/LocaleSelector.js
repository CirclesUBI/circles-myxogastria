import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import { Select, MenuItem, InputBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import translate, { setLocale, currentLocale } from '~/services/locale';
import { LOCALES } from 'locales';

const useStyles = makeStyles((theme) => ({
  select: {
    color: theme.palette.primary.contrastText,
  },
  selectInverted: {
    color: theme.palette.text.primary,
  },
  selectIcon: {
    fill: theme.palette.primary.contrastText,
  },
  selectIconInverted: {
    fill: theme.palette.text.primary,
  },
  selectInput: {
    padding: theme.spacing(1),
    backgroundColor: 'transparent',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.primary.contrastText}`,
    fontSize: 14,
    '&:focus': {
      borderRadius: theme.shape.borderRadius,
    },
  },
  selectInputInverted: {
    border: 0,
  },
}));

const LocaleSelector = (props) => {
  const classes = useStyles();

  const onSelect = (event) => {
    setLocale(event.target.value);
    window.location.reload();
  };

  return (
    <Select
      classes={
        props.isInvertedColor
          ? { root: classes.selectInverted, icon: classes.selectIconInverted }
          : { root: classes.select, icon: classes.selectIcon }
      }
      input={
        <InputBase
          classes={{
            input: clsx(classes.selectInput, {
              [classes.selectInputInverted]: props.isInvertedColor,
            }),
          }}
        />
      }
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

LocaleSelector.propTypes = {
  isInvertedColor: PropTypes.bool,
};

export default LocaleSelector;
