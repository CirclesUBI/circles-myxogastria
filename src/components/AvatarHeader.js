import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { MY_PROFILE_PATH } from '~/routes';

import Avatar from '~/components/Avatar';
import UsernameDisplay from '~/components/UsernameDisplay';

const useStyles = makeStyles((theme) => ({
  userDataContainer: {
    position: 'absolute',
    top: '45px',
    width: '80px',
    left: '0',
    right: '0',
    margin: '0 auto',
  },
  textContainer: {
    textAlign: 'center',
    marginTop: '8px',

    '& a': {
      fontSize: '18px',
      textDecoration: 'none',
      color: theme.custom.colors.black,
      fontWeight: 'black',
    },
  },
}));

const AvatarHeader = () => {
  const classes = useStyles();

  const safe = useSelector((state) => state.safe);

  return (
    <Box className={classes.userDataContainer}>
      <Avatar
        address={safe.currentAccount}
        className={classes.avatarContainer}
        size={'smallXl'}
      ></Avatar>
      <Box className={classes.textContainer}>
        <Link className={classes.profileLink} to={MY_PROFILE_PATH}>
          <UsernameDisplay address={safe.currentAccount} />
        </Link>
      </Box>
    </Box>
  );
};

export default AvatarHeader;
