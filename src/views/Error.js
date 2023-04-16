import { Box, Container, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import AppNote from '~/components/AppNote';
import Button from '~/components/Button';
import DialogBurn from '~/components/DialogBurn';
import HumbleAlert from '~/components/HumbleAlert';
import View from '~/components/View';
import translate from '~/services/locale';
import { colors } from '~/styles/theme';

const CriticalError = () => {
  const { app, wallet, safe, token } = useSelector((state) => state);
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);

  const handleConfirmOpen = () => {
    setIsConfirmationShown(true);
  };

  const handleConfirmClose = () => {
    setIsConfirmationShown(false);
  };

  const onReload = () => {
    window.location.reload();
  };

  return (
    <View>
      <DialogBurn isOpen={isConfirmationShown} onClose={handleConfirmClose} />
      <Container maxWidth="sm">
        <Typography align="center" gutterBottom>
          {app.isErrorCritical
            ? translate('CriticalError.bodyCriticalErrorDescription')
            : translate('CriticalError.bodyCriticalErrorTryAgain')}
        </Typography>
        <AppNote messageVersion="error" />
        {app.errorMessage && (
          <Box my={2} style={{ wordBreak: 'break-word' }}>
            <HumbleAlert
              color={colors.blue100}
              icon="IconTriangleWarning"
              iconColor={colors.whiteAlmost}
            >
              <Typography
                classes={{ root: 'body1_white' }}
                gutterBottom
                variant="body1"
              >
                {app.errorMessage}
              </Typography>
              {wallet.address && (
                <Typography
                  classes={{ root: 'body4_white' }}
                  component="p"
                  variant="body4"
                >
                  Device: {wallet.address}
                </Typography>
              )}
              {safe.currentAccount && (
                <Typography
                  classes={{ root: 'body4_white' }}
                  component="p"
                  variant="body4"
                >
                  Safe: {safe.currentAccount}
                </Typography>
              )}
              {token.address && (
                <Typography
                  classes={{ root: 'body4_white' }}
                  component="p"
                  variant="body4"
                >
                  Token: {token.address}
                </Typography>
              )}
            </HumbleAlert>
          </Box>
        )}
        <Button fullWidth onClick={onReload}>
          {translate('CriticalError.buttonReload')}
        </Button>
        <Box mt={2}>
          <Button fullWidth isDanger onClick={handleConfirmOpen}>
            {translate('CriticalError.buttonBurnWallet')}
          </Button>
        </Box>
      </Container>
    </View>
  );
};

export default CriticalError;
