import {
  Box,
  Container,
  Link as MuiLink,
  Paper,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { ONBOARDING_PATH } from '~/routes';

import LoginIconSVG from '%/images/login.svg';
import AppNote from '~/components/AppNote';
import BackgroundCurved from '~/components/BackgroundCurved';
import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import ExternalLink from '~/components/ExternalLink';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import Input from '~/components/Input';
import View from '~/components/View';
import translate from '~/services/locale';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { restoreAccount } from '~/store/onboarding/actions';
import { EMAIL_URL } from '~/utils/constants';
import {
  RESTORE_ACCOUNT_INVALID_SEED_PHRASE,
  RESTORE_ACCOUNT_UNKNOWN_SAFE,
} from '~/utils/errors';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    zIndex: theme.zIndex.layer1,
  },

  textContainer: {
    textAlign: 'center',
    maxWidth: '250px',
    margin: '0 auto',
  },

  loginImg: {
    textAlign: 'center',
    marginTop: '-41px',
  },

  paperContainer: {
    boxShadow: 'none',
  },
}));

const Login = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [seedPhrase, setSeedPhrase] = useState('');

  const handleChange = (event) => {
    setSeedPhrase(event.target.value);
  };

  const handleSubmitSeedPhrase = async () => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(restoreAccount(parsedPhrase.join(' ')));

      dispatch(
        notify({
          text: translate('Login.successWelcome'),
          type: NotificationsTypes.SUCCESS,
        }),
      );
    } catch (error) {
      let translationId = 'Login.errorRestoreFailedUnknown';
      if (error.message === RESTORE_ACCOUNT_INVALID_SEED_PHRASE) {
        translationId = 'Login.errorRestoreFailedInvalidSeedphrase';
      } else if (error.message === RESTORE_ACCOUNT_UNKNOWN_SAFE) {
        translationId = 'Login.errorRestoreFailedUnknownSafe';
      }

      dispatch(
        notify({
          text: translate(translationId),
          type: NotificationsTypes.ERROR,
          lifetime: 10000,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  const parsedPhrase = seedPhrase.trim().split(/\s+/g);
  const isValid = parsedPhrase.length === 24;

  return (
    <BackgroundCurved gradient="turquoise">
      <Header>
        <ButtonBack />
      </Header>
      <View>
        <Container className={classes.container} maxWidth="sm">
          <Box className={classes.loginImg}>
            <LoginIconSVG></LoginIconSVG>
          </Box>
          <Box mb={7} mt={14}>
            <Typography align="center" gutterBottom variant="h6">
              {translate('Login.headingLogin')}
            </Typography>
            <Typography className={classes.textContainer} variant="body2">
              {translate('Login.bodyEnterYourSeedPhrase')}
            </Typography>
            <Paper classes={{ root: classes.paperContainer }} p={2}>
              <Input
                fullWidth
                id="seedPhrase"
                isError={seedPhrase.length > 0 && !isValid}
                multiline
                placeholder={translate('Login.inputPlaceholder')}
                rows={4}
                value={seedPhrase}
                onChange={handleChange}
              />
            </Paper>
          </Box>
          <Typography align="center">
            {translate('Login.bodyLostYourSeedPhrase')}{' '}
            <MuiLink component={Link} to={ONBOARDING_PATH} underline="hover">
              {translate('Login.buttonCreateNewWallet')}
            </MuiLink>
          </Typography>
          <Typography align="center">
            {translate('Login.bodyNeedHelp')}{' '}
            <ExternalLink href={EMAIL_URL} underline="hover">
              {translate('Login.linkSupport')}
            </ExternalLink>
          </Typography>
        </Container>
      </View>
      <Footer>
        <AppNote messageVersion="login" />
        <Button disabled={!isValid} fullWidth onClick={handleSubmitSeedPhrase}>
          {translate('Login.buttonSubmit')}
        </Button>
      </Footer>
    </BackgroundCurved>
  );
};

export default Login;
