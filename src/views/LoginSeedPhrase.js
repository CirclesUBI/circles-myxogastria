import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Container,
  Typography,
  Link as MuiLink,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import CenteredHeading from '~/components/CenteredHeading';
import ExternalLink from '~/components/ExternalLink';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import Input from '~/components/Input';
import View from '~/components/View';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { ONBOARDING_PATH } from '~/routes';
import { SUPPORT_URL } from '~/utils/constants';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { restoreAccount } from '~/store/onboarding/actions';

const LoginSeedPhrase = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const dispatch = useDispatch();

  const onChange = (event) => {
    setSeedPhrase(event.target.value);
  };

  const onClick = async () => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(restoreAccount(seedPhrase.trim()));

      dispatch(
        notify({
          text: translate('LoginSeedPhrase.successWelcome'),
          type: NotificationsTypes.SUCCESS,
        }),
      );
    } catch (error) {
      dispatch(
        notify({
          text: translate('LoginSeedPhrase.errorMessage'),
          type: NotificationsTypes.ERROR,
          lifetime: 10000,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  const isValid = seedPhrase.trim().split(' ').length === 24;

  return (
    <Fragment>
      <Header>
        <ButtonBack />
        <CenteredHeading>
          {translate('LoginSeedPhrase.headingLoginSeedPhrase')}
        </CenteredHeading>
        <ButtonHome />
      </Header>
      <View>
        <Container maxWidth="sm">
          <Typography align="center">
            {translate('LoginSeedPhrase.bodyEnterYourSeedPhrase')}
          </Typography>
          <Box my={7}>
            <Paper p={2}>
              <Input
                fullWidth
                id="seedPhrase"
                isShowingCheck={false}
                multiline
                rows={4}
                value={seedPhrase}
                onChange={onChange}
              />
            </Paper>
          </Box>
          <Typography align="center">
            {translate('LoginSeedPhrase.bodyLostYourSeedPhrase')}{' '}
            <MuiLink component={Link} to={ONBOARDING_PATH}>
              {translate('Login.buttonCreateNewWallet')}
            </MuiLink>
          </Typography>
          <Typography align="center">
            {translate('LoginSeedPhrase.bodyNeedHelp')}{' '}
            <ExternalLink href={SUPPORT_URL}>
              {translate('LoginSeedPhrase.linkSupport')}
            </ExternalLink>
          </Typography>
        </Container>
      </View>
      <Footer>
        <Button disabled={!isValid} fullWidth isPrimary onClick={onClick}>
          {translate('LoginSeedPhrase.buttonSubmit')}
        </Button>
      </Footer>
    </Fragment>
  );
};

export default LoginSeedPhrase;
