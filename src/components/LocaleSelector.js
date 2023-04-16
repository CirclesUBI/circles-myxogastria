import { InputBase, MenuItem, Select } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { LOCALES } from 'locales';
import PropTypes from 'prop-types';
import React from 'react';

import translate, { currentLocale, setLocale } from '~/services/locale';
import { fontSizeRegular } from '~/styles/fonts';

const useStyles = makeStyles((theme) => ({
  select: {
    color: theme.custom.colors.purple100,
  },
  selectInverted: {
    color: theme.custom.colors.purple100,
  },
  selectIcon: {
    fill: theme.palette.primary.contrastText,
  },
  selectIconInverted: {
    fill: theme.custom.colors.purple100,
  },
  selectInput: {
    color: theme.custom.colors.whiteAlmost,
    padding: theme.spacing(1),
    backgroundColor: 'transparent',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.palette.primary.contrastText}`,
    fontSize: fontSizeRegular,
    '&:focus': {
      borderRadius: theme.shape.borderRadius,
    },
  },
  selectInputInverted: {
    border: 0,
    color: theme.custom.colors.purple100,
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
