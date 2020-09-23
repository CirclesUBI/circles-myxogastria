import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import { Avatar as MuiAvatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Jazzicon from '~/components/Jazzicon';
import { useUserdata } from '~/hooks/username';

const useStyles = makeStyles((theme) => ({
  avatarSmall: {
    width: theme.custom.components.avatarSize,
    height: theme.custom.components.avatarSize,
  },
  avatarMedium: {
    width: theme.custom.components.avatarSize * 2,
    height: theme.custom.components.avatarSize * 2,
  },
  avatarLarge: {
    width: theme.custom.components.avatarSize * 3,
    height: theme.custom.components.avatarSize * 3,
  },
}));

const Avatar = ({ address, size = 'small', className, ...props }) => {
  const classes = useStyles();

  const { avatarUrl, username } = useUserdata(address);
  const initials = username.slice(0, 2) === '0x' ? null : username.slice(0, 2);

  return (
    <MuiAvatar
      alt={username}
      className={clsx(className, {
        [classes.avatarSmall]: size === 'small',
        [classes.avatarMedium]: size === 'medium',
        [classes.avatarLarge]: size === 'large',
      })}
      src={avatarUrl}
      {...props}
    >
      {avatarUrl && initials ? (
        initials.toUpperCase()
      ) : (
        <Jazzicon address={address} size={size} />
      )}
    </MuiAvatar>
  );
};

Avatar.propTypes = {
  address: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.number,
};

export default Avatar;
