import { Box, Divider, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import { LOGIN_PATH, ONBOARDING_PATH } from '~/routes';

import Button from '~/components/Button';
import ExternalLink from '~/components/ExternalLink';
import Header from '~/components/Header';
import LocaleSelector from '~/components/LocaleSelector';
import Logo from '~/components/Logo';
import View from '~/components/View';
import translate from '~/services/locale';
import {
  ABOUT_URL,
  EMAIL_URL,
  FAQ_URL,
  PRIVACY_LEGAL_URL,
} from '~/utils/constants';

const useStyles = makeStyles((theme) => ({
  welcomeButton: {
    minWidth: 115,
    height: 37,
    paddingTop: theme.spacing(0.5),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
  },
  welcomeExternalLink: {
    color: theme.palette.text.primary,
    zIndex: theme.zIndex.layer2,
    position: 'relative',
  },
}));

const Welcome = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <Header>
        <Box display="flex" justifyContent="flex-end" width="100%">
          <LocaleSelector isInvertedColor />
        </Box>
      </Header>
      <View>
        <Logo isWithGang />
        <Box mb={1} mt={3}>
          <Typography align="center" variant="h1">
            {translate('Welcome.headingWelcomeToCircles')}
          </Typography>
        </Box>
        <Grid alignItems="center" container justifyContent="center">
          <Button
            className={classes.welcomeButton}
            isOutline
            to={ONBOARDING_PATH}
          >
            {translate('Welcome.buttonSignUp')}
          </Button>
          <Divider flexItem orientation="vertical" variant="middle" />
          <Button className={classes.welcomeButton} isPrimary to={LOGIN_PATH}>
            {translate('Welcome.buttonLogin')}
          </Button>
        </Grid>
        <Box mt={8} textAlign="center">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <WelcomeExternalLink href={ABOUT_URL}>
                {translate('Welcome.linkAboutCircles')}
              </WelcomeExternalLink>
            </Grid>
            <Grid item xs={12}>
              <WelcomeExternalLink href={FAQ_URL}>
                {translate('Welcome.linkFAQ')}
              </WelcomeExternalLink>
            </Grid>
            <Grid item xs={12}>
              <WelcomeExternalLink href={EMAIL_URL}>
                {translate('Welcome.linkContactUs')}
              </WelcomeExternalLink>
            </Grid>
            <Grid item xs={12}>
              <WelcomeExternalLink href={PRIVACY_LEGAL_URL}>
                {translate('Welcome.linkPrivacyLegal')}
              </WelcomeExternalLink>
            </Grid>
          </Grid>
        </Box>
      </View>
    </Fragment>
  );
};

const WelcomeExternalLink = ({ children, href }) => {
  const classes = useStyles();

  return (
    <ExternalLink className={classes.welcomeExternalLink} href={href}>
      {children}
    </ExternalLink>
  );
};

WelcomeExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default Welcome;
