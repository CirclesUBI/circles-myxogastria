import React, { Fragment, useEffect, useState } from 'react';
import {
  Box,
  Container,
  Dialog,
  List,
  ListItem,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link as MuiLink,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import CenteredHeading from '~/components/CenteredHeading';
import ExternalLink from '~/components/ExternalLink';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import QRCode from '~/components/QRCode';
import View from '~/components/View';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { LOGIN_SEED_PHRASE_PATH, ONBOARDING_PATH } from '~/routes';
import { SUPPORT_URL } from '~/utils/constants';
import { switchAccount } from '~/store/onboarding/actions';

const Login = () => {
  const dispatch = useDispatch();
  const { wallet, safe } = useSelector((state) => state);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const onConnect = () => {
    dispatch(switchAccount(safe.accounts[0]));

    dispatch(
      notify({
        text: translate('Login.successWelcome'),
        type: NotificationsTypes.SUCCESS,
      }),
    );
  };

  const onSelectorOpen = () => {
    setIsSelectorOpen(true);
  };

  const onSelectorClose = () => {
    setIsSelectorOpen(false);
  };

  useEffect(() => {
    setIsSelectorOpen(safe.accounts.length > 0);
  }, [safe.accounts]);

  return (
    <Fragment>
      <Header>
        <ButtonBack />
        <CenteredHeading>{translate('Login.headingLogin')}</CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <Typography align="center">
            {translate('Login.bodyUseThisQRCode')}
          </Typography>
          <Box my={2}>
            <QRCode data={wallet.address} />
          </Box>
          <Dialog
            aria-labelledby="form-dialog-title"
            open={isSelectorOpen}
            onClose={onSelectorClose}
          >
            <DialogTitle id="form-dialog-title">
              {translate('Login.dialogTitleSelector')}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {translate('Login.dialogBodySelector')}
              </DialogContentText>
              <List>
                {safe.accounts.map((account) => {
                  return <ListItem key={account}>{account}</ListItem>;
                })}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={onSelectorClose}>
                {translate('Login.dialogActionClose')}
              </Button>
              <Button isPrimary onClick={onConnect}>
                {translate('Login.dialogActionConnect')}
              </Button>
            </DialogActions>
          </Dialog>
          {safe.accounts.length > 0 && (
            <Box my={2}>
              <Button fullWidth isOutline onClick={onSelectorOpen}>
                {translate('Login.buttonShowSelector')}
              </Button>
            </Box>
          )}
          <Typography align="center" gutterBottom>
            {translate('Login.bodyCreateNewWallet')}{' '}
            <MuiLink component={Link} to={ONBOARDING_PATH}>
              {translate('Login.buttonCreateNewWallet')}
            </MuiLink>
          </Typography>
          <Typography align="center">
            {translate('Login.bodyNeedHelp')}{' '}
            <ExternalLink href={SUPPORT_URL}>
              {translate('Login.linkSupport')}
            </ExternalLink>
          </Typography>
        </Container>
      </View>
      <Footer>
        <Button fullWidth isPrimary to={LOGIN_SEED_PHRASE_PATH}>
          {translate('Login.buttonRestoreWithSeedPhrase')}
        </Button>
      </Footer>
    </Fragment>
  );
};

export default Login;
