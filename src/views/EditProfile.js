import { Avatar, Badge, Box, Container, IconButton } from '@material-ui/core';
import { Fragment } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import { useParams } from 'react-router-dom';

//import Avatar from '~/components/Avatar';
//import Button from '~/components/Button';
import AvatarHeader from '~/components/AvatarHeader';
import ButtonBack from '~/components/ButtonBack';
import ButtonClose from '~/components/ButtonClose';
import CenteredHeading from '~/components/CenteredHeading';
import Header from '~/components/Header';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import translate from '~/services/locale';

import {
  IconCamera,
} from '~/styles/icons';

const EditProfile = () => {
  //const dispatch = useDispatch();
  const safe = useSelector((state) => state.safe);
  const displayedUsername = safe.currentAccount ? (
    <UsernameDisplay address={safe.currentAccount} />
  ) : safe.pendingAddress ? (
    <UsernameDisplay address={safe.pendingAddress} />
  ) : null;

  return (
    <Fragment>
      <Header>
        <ButtonBack />
        <CenteredHeading>{translate('EditProfile.heading')}</CenteredHeading>
      </Header>
      <View>
        <Container>
          <AvatarHeader />
          <Box>
            <Badge 
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton>
                  <IconCamera className={classes.trustButtonIcon} />
                </IconButton> 
              }
            >
              <Avatar/>
            </Badge>  
          </Box>
          <ButtonClose></ButtonClose>
        </Container>
      </View>
    </Fragment>
  );
};

export default EditProfile;
