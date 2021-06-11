import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import {
  Box,
  Grid,
  ButtonGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';

import Avatar from '~/components/Avatar';
import AvatarWithQR from '~/components/AvatarWithQR';
import Button from '~/components/Button';
import UsernameDisplay from '~/components/UsernameDisplay';
import translate from '~/services/locale';
import { IconAdd, IconCheck } from '~/styles/icons';
import { SHARE_PATH, ORGANIZATION_PATH, DASHBOARD_PATH } from '~/routes';
import { checkSharedSafeState } from '~/store/safe/actions';
import { switchAccount } from '~/store/app/actions';
import { useRelativeProfileLink } from '~/hooks/url';
import { useUpdateLoop } from '~/hooks/update';

const useStyles = makeStyles(() => ({
  listItem: {
    height: 70,
  },
  createSharedWalletIcon: {
    marginLeft: 8,
  },
}));

const MyProfile = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isRedirect, setIsRedirect] = useState(false);

  const safe = useSelector((state) => state.safe);
  const profilePath = useRelativeProfileLink(safe.currentAccount);

  useUpdateLoop(async () => {
    await dispatch(checkSharedSafeState());
  });

  const handleAccountSwitch = (account) => {
    dispatch(switchAccount(account));
    setIsRedirect(true);
  };

  if (isRedirect) {
    return <Redirect push to={DASHBOARD_PATH} />;
  }

  return (
    <Fragment>
      <Grid alignItems="center" container spacing={2}>
        <Grid item xs={12}>
          <Box alignItems="center" display="flex">
            <Link to={SHARE_PATH}>
              <AvatarWithQR address={safe.currentAccount} size="medium" />
            </Link>
            <Box mx={2}>
              <Typography align="left">
                <UsernameDisplay address={safe.currentAccount} />
              </Typography>
            </Box>
            <Box flex={1}>
              <Typography align="right">
                <IconCheck />
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ButtonGroup fullWidth>
            <Button isOutline to={profilePath}>
              {translate('MyProfile.buttonShowProfile')}
            </Button>
            <Button isPrimary to={SHARE_PATH}>
              {translate('MyProfile.buttonShowQR')}
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      <List>
        {safe.accounts
          .filter((account) => {
            return account !== safe.currentAccount;
          })
          .map((account) => {
            return (
              <MyProfileAccount
                address={account}
                key={account}
                onSelect={handleAccountSwitch}
              />
            );
          })}
        {!safe.isOrganization && (
          <ListItem
            button
            className={classes.listItem}
            component={Link}
            to={ORGANIZATION_PATH}
          >
            <ListItemIcon className={classes.createSharedWalletIcon}>
              <IconAdd />
            </ListItemIcon>
            <ListItemText>
              {translate('MyProfile.buttonCreateSharedWallet')}
            </ListItemText>
          </ListItem>
        )}
      </List>
    </Fragment>
  );
};

const MyProfileAccount = ({ address, onSelect }) => {
  const classes = useStyles();

  const handleSelect = () => {
    onSelect(address);
  };

  return (
    <ListItem
      button
      className={classes.listItem}
      divider
      onClick={handleSelect}
    >
      <ListItemAvatar>
        <Avatar address={address} size="tiny" />
      </ListItemAvatar>
      <ListItemText>
        <UsernameDisplay address={address} />
      </ListItemText>
    </ListItem>
  );
};

MyProfileAccount.propTypes = {
  address: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default MyProfile;
