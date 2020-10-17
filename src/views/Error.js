import React, { useState } from 'react';
import { Box, Container, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

import Button from '~/components/Button';
import DialogBurn from '~/components/DialogBurn';
import HumbleAlert from '~/components/HumbleAlert';
import View from '~/components/View';
import translate from '~/services/locale';

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
        {app.errorMessage && (
          <Box my={2} style={{ wordBreak: 'break-word' }}>
            <HumbleAlert>
              <Typography gutterBottom>{app.errorMessage}</Typography>
              {wallet.address && (
                <Typography component="p" variant="caption">
                  Device: {wallet.address}
                </Typography>
              )}
              {safe.currentAccount && (
                <Typography component="p" variant="caption">
                  Safe: {safe.currentAccount}
                </Typography>
              )}
              {token.address && (
                <Typography component="p" variant="caption">
                  Token: {token.address}
                </Typography>
              )}
            </HumbleAlert>
          </Box>
        )}
        <Button fullWidth isPrimary onClick={onReload}>
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
