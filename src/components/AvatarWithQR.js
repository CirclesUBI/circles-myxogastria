import { Badge } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

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
      overlap="circular"
    >
      <Avatar address={address} {...props} />
    </Badge>
  );
};

AvatarWithQR.propTypes = {
  address: PropTypes.string.isRequired,
};

export default AvatarWithQR;
