import { Box, Avatar as MuiAvatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import GroupWalletCircleSVG from '%/images/organization-indicator.svg';
import Jazzicon from '~/components/Jazzicon';
import { useIsOrganization, useUserdata } from '~/hooks/username';
import { IconPlus } from '~/styles/icons';

const ORGANIZATION_RING_MULTIPLIER = 1.085;

const SIZE_MULTIPLIERS = {
  tiny: 0.8,
  small: 1,
  smallXl: 1.6,
  medium: 2,
  large: 3,
};

const useStyles = makeStyles((theme) => ({
  avatarContainer: {
    position: 'relative',
    margin: '0 auto',
    cursor: 'pointer',
  },
  organizationIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  circleGrey: {
    background: theme.custom.colors.greyHover,
    border: `2px solid ${theme.custom.colors.blue100}`,
    position: 'absolute',
    left: '-1px',
    top: '-1px',
    borderRadius: '50%',
    zIndex: theme.zIndex.layer1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    transition: 'opacity 0.1s ease-in-out',
  },
  isHovered: {
    opacity: 1,
  },
  plusIcon: {
    fontSize: '20px',
  },
}));

const Avatar = ({
  address,
  size = 'small',
  url,
  useCache,
  hidePlusIcon,
  withHoverEffect,
  withClickEffect,
  ...props
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  let { avatarUrl, username } = useUserdata(address, useCache);

  if (url) avatarUrl = url;

  const { isOrganization } = useIsOrganization(address);

  const sizePixelAvatar =
    theme.custom.components.avatarSize * SIZE_MULTIPLIERS[size];
  const sizePixelRing = sizePixelAvatar * ORGANIZATION_RING_MULTIPLIER;
  const initials = username.slice(0, 2) === '0x' ? null : username.slice(0, 2);

  return (
    <Box
      className={classes.avatarContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isOrganization && (
        <Box className={classes.organizationIndicator}>
          <GroupWalletCircleSVG width={sizePixelRing} />
        </Box>
      )}
      {(withHoverEffect || withClickEffect) && (
        <Box className={classes.withClickEffect}>
          <Box
            className={clsx(classes.circleGrey, {
              [classes.isHovered]: isHovered || withClickEffect,
            })}
            style={{
              width: sizePixelAvatar + 2,
              height: sizePixelAvatar + 2,
            }}
          >
            {!hidePlusIcon && (
              <IconPlus
                className={classes.plusIcon}
                style={{ fontSize: size === 'large' ? '20px' : '16px' }}
              />
            )}
          </Box>
        </Box>
      )}
      <MuiAvatar
        alt={username}
        src={avatarUrl}
        style={{
          width: sizePixelAvatar,
          height: sizePixelAvatar,
        }}
        {...props}
      >
        {avatarUrl && initials
          ? initials.toUpperCase()
          : address && <Jazzicon address={address} size={sizePixelAvatar} />}
      </MuiAvatar>
    </Box>
  );
};

Avatar.propTypes = {
  address: PropTypes.string,
  hidePlusIcon: PropTypes.bool,
  size: PropTypes.string,
  url: PropTypes.string,
  useCache: PropTypes.bool,
  withClickEffect: PropTypes.bool,
  withHoverEffect: PropTypes.bool,
};

export default React.memo(Avatar);
