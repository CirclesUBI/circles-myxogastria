import PropTypes from 'prop-types';
import React from 'react';
import { Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '~/components/Avatar';
import { IconQR } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  avatarBadge: {
    color: theme.palette.text.primary,
  },
  avatarBadgeIcon: {
    padding: theme.spacing(0.25),
    backgroundColor: theme.palette.background.default,
  },
}));

const AvatarWithQR = ({ address, ...props }) => {
  const classes = useStyles();

  return (
    <Badge
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      badgeContent={<IconQR className={classes.avatarBadgeIcon} />}
      className={classes.avatarBadge}
      overlap="circle"
    >
      <Avatar address={address} {...props} />
    </Badge>
  );
};

AvatarWithQR.propTypes = {
  address: PropTypes.string.isRequired,
};

export default AvatarWithQR;
