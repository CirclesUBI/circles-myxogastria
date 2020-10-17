import PropTypes from 'prop-types';
import React from 'react';
import { Avatar as MuiAvatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import Jazzicon from '~/components/Jazzicon';
import { useUserdata, useIsOrganization } from '~/hooks/username';

const SIZE_MULTIPLIERS = {
  tiny: 0.8,
  small: 1,
  medium: 2,
  large: 3,
};

const useStyles = makeStyles((theme) => ({
  avatarOrganization: {
    border: `4px solid ${theme.custom.colors.orange}`,
  },
}));

const Avatar = ({ address, size = 'small', ...props }) => {
  const theme = useTheme();
  const classes = useStyles();

  const { avatarUrl, username } = useUserdata(address);
  const { isOrganization } = useIsOrganization(address);

  const sizePixel = theme.custom.components.avatarSize * SIZE_MULTIPLIERS[size];
  const initials = username.slice(0, 2) === '0x' ? null : username.slice(0, 2);

  return (
    <MuiAvatar
      alt={username}
      className={isOrganization ? classes.avatarOrganization : undefined}
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
