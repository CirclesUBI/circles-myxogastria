import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Typography,
} from '@material-ui/core';

import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import CenteredHeading from '~/components/CenteredHeading';
import Header from '~/components/Header';
import View from '~/components/View';
import translate from '~/services/locale';
import { burnApp } from '~/store/app/actions';

const Devices = () => {
  const dispatch = useDispatch();
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
        aria-describedby="alert-burn-description"
        aria-labelledby="alert-burn-title"
        open={isConfirmationShown}
        onClose={handleConfirmClose}
      >
        <DialogTitle id="alert-burn-title">
          {translate('Devices.dialogBurnTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-burn-description">
            {translate('Devices.dialogBurnDescription')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button isOutline onClick={handleConfirmClose}>
            {translate('Devices.dialogBurnCancel')}
          </Button>
          <Button autoFocus isPrimary onClick={handleBurn}>
            {translate('Devices.dialogBurnConfirm')}
          </Button>
        </DialogActions>
      </Dialog>
      <Header>
        <ButtonBack />
        <CenteredHeading>
          {translate('Devices.headingManageDevices')}
        </CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <Paper>
            <Box p={2}>
              <Typography align="center" variant="h6">
                {translate('Devices.headingDangerZone')}
              </Typography>
              <Box my={2}>
                <Button fullWidth isDanger onClick={handleConfirmOpen}>
                  {translate('Devices.buttonBurnWallet')}
                </Button>
              </Box>
            </Box>
          </Paper>
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

export default Devices;
