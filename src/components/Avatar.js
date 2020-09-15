import PropTypes from 'prop-types';
import React from 'react';
import { Avatar as MuiAvatar } from '@material-ui/core';

import Jazzicon from '~/components/Jazzicon';
import { useUserdata } from '~/hooks/username';

const Avatar = ({ address, size = 50, ...props }) => {
  const { avatarUrl, username } = useUserdata(address);
  const initials = username.slice(0, 2) === '0x' ? null : username.slice(0, 2);

  return (
    <MuiAvatar
      alt={username}
      src={avatarUrl}
      style={{
        width: size,
        height: size,
      }}
      {...props}
    >
      {initials ? initials : <Jazzicon address={address} size={size} />}
    </MuiAvatar>
  );
};

Avatar.propTypes = {
  address: PropTypes.string.isRequired,
  size: PropTypes.number,
};

export default Avatar;
