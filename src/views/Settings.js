import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Chip,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';

import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import CenteredHeading from '~/components/CenteredHeading';
import Dialog from '~/components/Dialog';
import Header from '~/components/Header';
import View from '~/components/View';
import translate from '~/services/locale';
import { burnApp } from '~/store/app/actions';

const Settings = () => {
  const dispatch = useDispatch();
  const wallet = useSelector((state) => state.wallet);
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);

  const handleBurn = () => {
    dispatch(burnApp());
  };

  const handleConfirmOpen = () => {
    setIsConfirmationShown(true);
  };

  const handleConfirmClose = () => {
    setIsConfirmationShown(false);
  };

  return (
    <Fragment>
      <Dialog
        cancelLabel={translate('Settings.dialogBurnCancel')}
        confirmLabel={translate('Settings.dialogBurnConfirm')}
        id="burn"
        open={isConfirmationShown}
        text={translate('Settings.dialogBurnDescription')}
        title={translate('Settings.dialogBurnTitle')}
        onClose={handleConfirmClose}
        onConfirm={handleBurn}
      />
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
                  <Typography align="center" gutterBottom variant="h6">
                    {translate('Settings.headingPublicAddress')}
                  </Typography>
                  <Chip label={wallet.address} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <Box p={2}>
                  <Typography align="center" variant="h6">
                    {translate('Settings.headingDangerZone')}
                  </Typography>
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

export default Settings;
