import PropTypes from 'prop-types';
import React from 'react';
import { Avatar as MuiAvatar, Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import Jazzicon from '~/components/Jazzicon';
import { IconWorld } from '~/styles/icons';
import { useUserdata, useIsOrganization } from '~/hooks/username';

const SIZE_MULTIPLIERS = {
  tiny: 0.8,
  small: 1,
  medium: 2,
  large: 3,
};

const useStyles = makeStyles((theme) => ({
  badge: {
    padding: theme.spacing(0.1),
    color: theme.palette.common.white,
    backgroundColor: theme.custom.colors.orange,
    borderRadius: '50%',
  },
}));

const Avatar = ({ address, size = 'small', ...props }) => {
  const theme = useTheme();
  const classes = useStyles();
  const isOrganization = useIsOrganization(address);
  const sizePixel = theme.custom.components.avatarSize * SIZE_MULTIPLIERS[size];

  if (!isOrganization) {
    return <AvatarInner address={address} sizePixel={sizePixel} {...props} />;
  }

  return (
    <Badge
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      badgeContent={<IconWorld className={classes.badge} fontSize="inherit" />}
      overlap="circle"
    >
      <AvatarInner address={address} sizePixel={sizePixel} {...props} />
    </Badge>
  );
};

const AvatarInner = ({ address, sizePixel, ...props }) => {
  const { avatarUrl, username } = useUserdata(address);
  const initials = username.slice(0, 2) === '0x' ? null : username.slice(0, 2);

  return (
    <MuiAvatar
      alt={username}
      src={avatarUrl}
      style={{
        width: sizePixel,
        height: sizePixel,
      }}
      {...props}
    >
      {avatarUrl && initials ? (
        initials.toUpperCase()
      ) : (
        <Jazzicon address={address} size={sizePixel} />
      )}
    </MuiAvatar>
  );
};

Avatar.propTypes = {
  address: PropTypes.string.isRequired,
  size: PropTypes.string,
};

AvatarInner.propTypes = {
  address: PropTypes.string.isRequired,
  sizePixel: PropTypes.number.isRequired,
};

export default React.memo(Avatar);
