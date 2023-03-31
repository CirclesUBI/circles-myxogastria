import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import {
  DASHBOARD_PATH,
  EDIT_PROFILE_PATH,
  ORGANIZATION_PATH,
  SHARE_PATH,
} from '~/routes';

import Avatar from '~/components/Avatar';
import AvatarWithQR from '~/components/AvatarWithQR';
import ButtonDouble from '~/components/ButtonDouble';
import UsernameDisplay from '~/components/UsernameDisplay';
import { useUpdateLoop } from '~/hooks/update';
import translate from '~/services/locale';
import { switchAccount } from '~/store/app/actions';
import { checkSharedSafeState } from '~/store/safe/actions';
import { IconAdd, IconCheck } from '~/styles/icons';

const useStyles = makeStyles(() => ({
  listItem: {
    height: 70,
  },
  createOrganizationIcon: {
    marginLeft: 8,
  },
}));

const MyProfile = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isRedirect, setIsRedirect] = useState(false);

  const safe = useSelector((state) => state.safe);

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
          <ButtonDouble
            leftBtnPath={EDIT_PROFILE_PATH}
            leftBtnText={translate('MyProfile.buttonEditProfile')}
            rightBtnPath={SHARE_PATH}
            rightBtnText={translate('MyProfile.buttonShareProfile')}
          />
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
            <ListItemIcon className={classes.createOrganizationIcon}>
              <IconAdd />
            </ListItemIcon>
            <ListItemText>
              {translate('MyProfile.buttonCreateOrganization')}
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
