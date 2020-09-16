import React, { Fragment } from 'react';
import { Grid, ButtonGroup, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import AvatarWithQR from '~/components/AvatarWithQR';
import Button from '~/components/Button';
import UsernameDisplay from '~/components/UsernameDisplay';
import translate from '~/services/locale';
import { IconCheck } from '~/styles/icons';
import { SHARE_PATH } from '~/routes';
import { useRelativeProfileLink } from '~/hooks/url';

const MyProfile = () => {
  const safe = useSelector((state) => state.safe);
  const profilePath = useRelativeProfileLink(safe.currentAccount);

  return (
    <Fragment>
      <Grid alignItems="center" container spacing={2}>
        <Grid item xs={2}>
          <Link to={SHARE_PATH}>
            <AvatarWithQR address={safe.currentAccount} />
          </Link>
        </Grid>
        <Grid item xs={8}>
          <Typography align="left">
            <UsernameDisplay address={safe.currentAccount} />
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <IconCheck />
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
    </Fragment>
  );
};

export default MyProfile;
