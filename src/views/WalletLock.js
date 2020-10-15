import React, { Fragment, useState } from 'react';
import { Box, Typography, Container } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import Input from '~/components/Input';
import Logo from '~/components/Logo';
import View from '~/components/View';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { unlockAccount } from '~/store/onboarding/actions';

const WalletLock = () => {
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUnlock = async (event) => {
    event.preventDefault();

    setPassword('');
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(unlockAccount(password));

      dispatch(
        notify({
          text: translate('WalletLock.successUnlockWallet'),
          type: NotificationsTypes.SUCCESS,
        }),
      );
    } catch {
      dispatch(
        notify({
          text: translate('WalletLock.errorUnlockWallet'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  return (
    <Fragment>
      <View>
        <Container maxWidth="sm">
          <Box mb={4} mt={10} mx="auto">
            <Logo />
          </Box>
          <Typography align="center" gutterBottom variant="h6">
            {translate('WalletLock.bodyPleaseEnterPassword')}
          </Typography>
          <form>
            <Box align="center" my={2}>
              <Input
                id="password"
                label={translate('WalletLock.formPassword')}
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
              />
            </Box>
            <Button
              disabled={password.length === 0}
              fullWidth
              isPrimary
              type="submit"
              onClick={handleUnlock}
            >
              {translate('WalletLock.buttonSubmit')}
            </Button>
          </form>
        </Container>
      </View>
    </Fragment>
  );
};

export default WalletLock;
