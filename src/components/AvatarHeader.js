import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { MY_PROFILE_PATH } from '~/routes';

import Avatar from '~/components/Avatar';
import UsernameDisplay from '~/components/UsernameDisplay';

const useStyles = makeStyles(() => ({
  avatarContainer: {
    height: '80px',
    margin: '0 auto',
    width: '80px',
  },
  userDataContainer: {
    top: '45px',
    position: 'relative',
    margin: '0 auto',
  },
  textContainer: {
    textAlign: 'center',
    marginTop: '8px',

    '& a': {
      textDecoration: 'none',
    },
  },
}));

const AvatarHeader = ({
  hideImage,
  hidePlusIcon,
  url,
  username,
  useCache = true,
  withClickEffect,
  withHoverEffect,
}) => {
  const classes = useStyles();

  const safe = useSelector((state) => state.safe);

  const displayedUsername = username ? (
    `@${username}`
  ) : safe.currentAccount ? (
    <UsernameDisplay address={safe.currentAccount} useCache={useCache} />
  ) : safe.pendingAddress ? (
    <UsernameDisplay address={safe.pendingAddress} useCache={useCache} />
  ) : null;

  return (
    <Box className={classes.userDataContainer}>
      <Box className={classes.avatarContainer}>
        {!hideImage && (
          <Link to={MY_PROFILE_PATH}>
            <Avatar
              address={safe.currentAccount || safe.pendingAddress}
              className={classes.avatarContainer}
              hidePlusIcon={hidePlusIcon}
              size={'smallXl'}
              url={url}
              useCache={useCache}
              withClickEffect={withClickEffect}
              withHoverEffect={withHoverEffect}
            />
          </Link>
        )}
      </Box>
      <Box className={classes.textContainer}>
        <Link className={classes.profileLink} to={MY_PROFILE_PATH}>
          <Typography variant="h3">{displayedUsername}</Typography>
        </Link>
      </Box>
    </Box>
  );
};

AvatarHeader.propTypes = {
  hideImage: PropTypes.bool,
  hidePlusIcon: PropTypes.bool,
  useCache: PropTypes.bool,
  username: PropTypes.string,
  url: PropTypes.string,
  withClickEffect: PropTypes.bool,
  withHoverEffect: PropTypes.bool,
};

export default AvatarHeader;
