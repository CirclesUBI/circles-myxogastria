import {
  Badge,
  Box,
  CircularProgress,
  Avatar as MuiAvatar,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from '~/components/Avatar';
import Logo from '~/components/Logo';
import {
  IconCirclesLogoLight,
  IconExclamationAndQuestionMark,
  IconHeartWithExclamationMark,
} from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  avatarTransparent: {
    width: theme.custom.components.avatarSize,
    height: theme.custom.components.avatarSize,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    '& svg': {
      fontSize: '32px',
    },
  },
}));

const iconSelector = (icon) => {
  switch (icon) {
    case 1:
      return IconCirclesLogoLight;
    case 2:
      return IconExclamationAndQuestionMark;
    case 3:
      return IconHeartWithExclamationMark;
    default:
      return IconCirclesLogoLight;
  }
};

const ActivityStreamItemAvatarNews = ({ iconId }) => {
  const classes = useStyles();

  const Icon = iconSelector(iconId);
  return (
    <Box className={classes.iconContainer}>
      <Icon />
    </Box>
  );
};

const ActivityStreamItemAvatar = ({
  profilePath,
  isPending,
  isUBIPayout,
  addressOrigin,
  addressTarget,
  type,
  iconId,
}) => {
  const classes = useStyles();

  if (type === 'NEWS') {
    return <ActivityStreamItemAvatarNews iconId={iconId} />;
  }

  return (
    <Link to={profilePath}>
      {isPending ? (
        <MuiAvatar className={classes.avatarTransparent}>
          <CircularProgress size={40} />
        </MuiAvatar>
      ) : isUBIPayout ? (
        <MuiAvatar className={classes.avatarTransparent}>
          <Logo size="tiny" />
        </MuiAvatar>
      ) : (
        <Box className={classes.avatarTransparent}>
          <ActivityStreamAvatars
            addressOrigin={addressOrigin}
            addressTarget={addressTarget}
          />
        </Box>
      )}
    </Link>
  );
};

const ActivityStreamAvatars = ({ addressOrigin, addressTarget }) => {
  return (
    <Badge
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      badgeContent={<Avatar address={addressTarget} size="tiny" />}
      overlap="circular"
    >
      <Avatar address={addressOrigin} size="tiny" />
    </Badge>
  );
};

ActivityStreamItemAvatar.propTypes = {
  addressOrigin: PropTypes.string,
  addressTarget: PropTypes.string,
  iconId: PropTypes.number,
  isPending: PropTypes.bool,
  isUBIPayout: PropTypes.bool,
  profilePath: PropTypes.string,
  type: PropTypes.oneOfType([PropTypes.symbol, PropTypes.string]),
};

ActivityStreamItemAvatarNews.propTypes = {
  iconId: PropTypes.number,
};

ActivityStreamAvatars.propTypes = {
  addressOrigin: PropTypes.string,
  addressTarget: PropTypes.string,
};

export default ActivityStreamItemAvatar;
