import { Box, Chip, Container, Grid, Paper, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';

import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import CenteredHeading from '~/components/CenteredHeading';
import DialogBurn from '~/components/DialogBurn';
import ExternalLink from '~/components/ExternalLink';
import Header from '~/components/Header';
import RemoveYourData from '~/components/RemoveYourData';
import View from '~/components/View';
import translate from '~/services/locale';

const useStyles = makeStyles(() => ({
  chip: {
    maxWidth: '100%',
    overflow: 'hidden',
  },
  chipClickable: {
    cursor: 'pointer',
  },
}));

const Settings = () => {
  const { wallet, safe, token } = useSelector((state) => state);
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);

  const handleConfirmOpen = () => {
    setIsConfirmationShown(true);
  };

  const handleConfirmClose = () => {
    setIsConfirmationShown(false);
  };

  return (
    <Fragment>
      <DialogBurn isOpen={isConfirmationShown} onClose={handleConfirmClose} />
      <Header>
        <ButtonBack />
        <CenteredHeading>
          {translate('Settings.headingSettings')}
        </CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper>
                <Box p={2} textAlign="center">
                  <Typography align="center" gutterBottom variant="h2">
                    {translate('Settings.headingStatus')}
                  </Typography>
                  <Typography align="center" gutterBottom>
                    {translate('Settings.bodyDeviceAddress')}
                  </Typography>
                  <SettingsExplorableAddress address={wallet.address} />
                  {safe.currentAccount && (
                    <Box mt={2}>
                      <Typography align="center" gutterBottom>
                        {translate('Settings.bodySafeAddress')}
                      </Typography>
                      <SettingsExplorableAddress
                        address={safe.currentAccount}
                      />
                    </Box>
                  )}
                  {token.address && (
                    <Box mt={2}>
                      <Typography align="center" gutterBottom>
                        {translate('Settings.bodyTokenAddress')}
                      </Typography>
                      <SettingsExplorableAddress address={token.address} />
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <Box p={2}>
                  <Typography align="center" variant="h2">
                    {translate('Settings.headingDangerZone')}
                  </Typography>
                  <Box my={2}>
                    <RemoveYourData />
                  </Box>
                  <Box my={2}>
                    <Button fullWidth isDanger onClick={handleConfirmOpen}>
                        {translate('Settings.buttonBurnWallet')}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          <Box mt={2}>
            <Typography align="center">
              v. {process.env.RELEASE_VERSION} (
              {process.env.CORE_RELEASE_VERSION})
            </Typography>
          </Box>
        </Container>
      </View>
    </Fragment>
  );
};

const SettingsExplorableAddress = ({ address }) => {
  const classes = useStyles();

  if (!process.env.EXPLORER_URL) {
    return <Chip className={classes.chip} label={address} />;
  }

  const url = process.env.EXPLORER_URL.replace(':address', address);

  return (
    <ExternalLink href={url} underline="hover">
      <Chip
        className={clsx(classes.chip, classes.chipClickable)}
        label={address}
      />
    </ExternalLink>
  );
};

SettingsExplorableAddress.propTypes = {
  address: PropTypes.string.isRequired,
};

export default Settings;
