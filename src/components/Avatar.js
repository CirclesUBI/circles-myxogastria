import { Box, Avatar as MuiAvatar } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import GroupWalletCircleSVG from '%/images/organization-indicator.svg';
import Jazzicon from '~/components/Jazzicon';
import { useIsOrganization, useUserdata } from '~/hooks/username';

const ORGANIZATION_RING_MULTIPLIER = 1.085;

const SIZE_MULTIPLIERS = {
  tiny: 0.8,
  small: 1,
  smallXl: 1.6,
  medium: 2,
  large: 3,
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
  const userInputs = useSelector((state) => state.userInputs);

  const { avatarUrl, username } = useUserdata(address);
  const { isOrganization } = useIsOrganization(address);

  const sizePixelAvatar =
    theme.custom.components.avatarSize * SIZE_MULTIPLIERS[size];
  const sizePixelRing = sizePixelAvatar * ORGANIZATION_RING_MULTIPLIER;
  const initials = username.slice(0, 2) === '0x' ? null : username.slice(0, 2);

  // if data is not ready take it from state
  let avatarUrlFixed = avatarUrl ? avatarUrl : userInputs?.avatarUrl;

  return (
    <Box className={classes.avatarContainer}>
      {isOrganization && (
        <Box className={classes.organizationIndicator}>
          <GroupWalletCircleSVG width={sizePixelRing} />
        </Box>
      )}
      <MuiAvatar
        alt={username}
        src={avatarUrlFixed}
        style={{
          width: sizePixelAvatar,
          height: sizePixelAvatar,
        }}
        {...props}
      >
        {avatarUrlFixed && initials
          ? initials.toUpperCase()
          : address && <Jazzicon address={address} size={sizePixelAvatar} />}
      </MuiAvatar>
    </Box>
  );
};

Avatar.propTypes = {
  address: PropTypes.string,
  size: PropTypes.string,
};

export default React.memo(Avatar);
