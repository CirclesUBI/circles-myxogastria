import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { DateTime } from 'luxon';
import { Grid, Typography, Link as MuiLink } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import Avatar from '~/components/Avatar';
import UsernameDisplay from '~/components/UsernameDisplay';
import core from '~/services/core';
import { CATEGORIES } from '~/store/activity/reducers';
import { useRelativeProfileLink } from '~/hooks/url';

const { ActivityTypes } = core.activity;

const MAX_PROFILES = 10;

const useStyles = makeStyles((theme) => ({
  username: {
    maxWidth: '100px',
    marginTop: theme.spacing(0.5),
    textAlign: 'center',
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
}));

const LastInteractions = () => {
  const { safe, activity } = useSelector((state) => state);

  // Collect all safeAddresses of last transfer and trust interactions known
  // from the activity stream
  const lastActiveProfiles = useMemo(() => {
    return CATEGORIES.reduce((acc, category) => {
      const addUniqueAndNotOwn = (safeAddress, createdAt) => {
        if (
          safeAddress !== safe.currentAccount &&
          !acc.find((item) => item.safeAddress === safeAddress)
        ) {
          acc.push({
            safeAddress,
            createdAt,
          });
        }
      };

      activity.categories[category].activities.forEach(
        ({ data, type, createdAt }) => {
          if (type === ActivityTypes.HUB_TRANSFER) {
            addUniqueAndNotOwn(data.from, createdAt);
            addUniqueAndNotOwn(data.to, createdAt);
          } else if (type === ActivityTypes.ADD_CONNECTION) {
            addUniqueAndNotOwn(data.user, createdAt);
            addUniqueAndNotOwn(data.canSendTo, createdAt);
          }
        },
      );
      return acc;
    }, [])
      .sort((itemA, itemB) => {
        return DateTime.fromISO(itemB.createdAt) <
          DateTime.fromISO(itemA.createdAt)
          ? -1
          : 1;
      })
      .slice(0, MAX_PROFILES);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Grid alignItems="center" container justify="center" spacing={1}>
      {lastActiveProfiles.map(({ safeAddress }) => {
        return (
          <LastInteractionsAccount address={safeAddress} key={safeAddress} />
        );
      })}
    </Grid>
  );
};

const LastInteractionsAccount = ({ address }) => {
  const classes = useStyles();
  const profilePath = useRelativeProfileLink(address);

  return (
    <Grid item>
      <MuiLink component={Link} to={profilePath}>
        <Avatar address={address} size="medium" />
        <Typography className={classes.username} noWrap>
          <UsernameDisplay address={address} />
        </Typography>
      </MuiLink>
    </Grid>
  );
};

LastInteractionsAccount.propTypes = {
  address: PropTypes.string.isRequired,
};

export default LastInteractions;
