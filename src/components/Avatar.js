import { Box, Avatar as MuiAvatar } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import GroupWalletCircleSVG from '%/images/organization-indicator.svg';
import Jazzicon from '~/components/Jazzicon';
import { useIsOrganization, useUserdata } from '~/hooks/username';

const SIZE_MULTIPLIERS = {
  tiny: 0.8,
  small: 1,
  smallXl: 1.6,
  medium: 2,
  large: 3,
};

const ORGANIZATION_RING_SIZES = {
  tiny: '77%',
  small: '108%',
  smallXl: '109%',
  medium: '108%',
  large: '108%',
};

const useStyles = makeStyles(() => ({
  avatarContainer: {
    position: 'relative',
    margin: '0 auto',
  },
  organizationIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));

const Avatar = ({ address, size = 'small', ...props }) => {
  const classes = useStyles();
  const theme = useTheme();

  const { avatarUrl, username } = useUserdata(address);
  const { isOrganization } = useIsOrganization(address);

  const sizePixel = theme.custom.components.avatarSize * SIZE_MULTIPLIERS[size];
  const initials = username.slice(0, 2) === '0x' ? null : username.slice(0, 2);

  return (
    <Box className={classes.avatarContainer}>
      {isOrganization && (
        <Box className={classes.organizationIndicator}>
          <GroupWalletCircleSVG width={ORGANIZATION_RING_SIZES[size]} />
        </Box>
      )}
      <MuiAvatar
        alt={username}
        src={avatarUrl}
        style={{
          width: sizePixel,
          height: sizePixel,
        }}
        {...props}
      >
        {avatarUrl && initials
          ? initials.toUpperCase()
          : address && <Jazzicon address={address} size={sizePixel} />}
      </MuiAvatar>
    </Box>
  );
};

Avatar.propTypes = {
  address: PropTypes.string,
  size: PropTypes.string,
};

export default React.memo(Avatar);
