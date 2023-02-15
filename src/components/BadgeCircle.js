import { Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  iconActive: {
    '& path': {
      fill: theme.custom.colors.violet,
    },
  },
  badgeContainer: {
    backgroundColor: theme.custom.colors.fountainBlue,
    fontSize: '12px',
    fontWeight: '700',
    minWidth: 'auto',
    padding: '0',
    width: '17px',
    height: '17px',
    right: '-6px',
  },
}));

const BadgeCircle = ({
  badgeContent,
  icon,
  color = 'primary',
  overlap = 'rectangular',
  isActive,
}) => {
  const classes = useStyles();

  const IconElement = icon;

  return (
    <Badge
      badgeContent={badgeContent}
      classes={{
        badge: classes.badgeContainer,
      }}
      color={color}
      overlap={overlap}
    >
      <IconElement
        className={clsx({
          [classes.iconActive]: isActive,
        })}
      />
    </Badge>
  );
};

BadgeCircle.propTypes = {
  badgeContent: PropTypes.number,
  color: PropTypes.string,
  icon: PropTypes.any,
  isActive: PropTypes.bool,
  overlap: PropTypes.string,
};

export default BadgeCircle;