import { Avatar as MuiAvatar } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import Jazzicon from '~/components/Jazzicon';
import { useUserdata } from '~/hooks/username';

const SIZE_MULTIPLIERS = {
  tiny: 0.8,
  small: 1,
  medium: 2,
  large: 3,
};

const Avatar = ({ address, size = 'small', ...props }) => {
  const theme = useTheme();

  const { avatarUrl, username } = useUserdata(address);

  const sizePixel = theme.custom.components.avatarSize * SIZE_MULTIPLIERS[size];
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

export default React.memo(Avatar);
