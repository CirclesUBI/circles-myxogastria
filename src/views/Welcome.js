import { Box, Divider, Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

import { LOGIN_PATH, ONBOARDING_PATH } from '~/routes';

import Button from '~/components/Button';
import ExternalLink from '~/components/ExternalLink';
import Header from '~/components/Header';
{
  /* We temporary disable language switcher since languages are not there but should come soon */
}
// import LocaleSelector from '~/components/LocaleSelector';
import Logo from '~/components/Logo';
import View from '~/components/View';
import translate from '~/services/locale';
import {
  BUG_REPORTING_URL,
  EMAIL_URL,
  FAQ_URL,
  PRIVACY_LEGAL_URL,
} from '~/utils/constants';

const useStyles = makeStyles((theme) => ({
  welcomeButton: {
    minWidth: 115,
    paddingTop: theme.spacing(0.5),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
  },
  welcomeExternalLink: {
    zIndex: theme.zIndex.layer2,
    position: 'relative',
    margin: '0 9px',

    [theme.breakpoints.up('sm')]: {
      margin: '0 10px',
    },
  },
  divider: {
    marginLeft: '16px',
    marginRight: '16px',
    height: '40px',
    backgroundColor: theme.custom.colors.black,
  },
  linkContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '20px',
    marginTop: 'auto',
  },
}));

const Welcome = () => {
  const classes = useStyles();

  return (
    <>
      <Header>
        {/* We temporary disable language switcher since languages are not there but should come soon */}
        {/* <Box display="flex" justifyContent="flex-end" width="100%">
          <LocaleSelector isInvertedColor />
        </Box> */}
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
          <Divider
            className={classes.divider}
            flexItem
            orientation="vertical"
            variant="middle"
          />
          <Button className={classes.welcomeButton} to={LOGIN_PATH}>
            {translate('Welcome.buttonLogin')}
          </Button>
        </Grid>
      </View>
      <Box className={classes.linkContainer} container spacing={1}>
        <WelcomeExternalLink href={FAQ_URL}>
          {translate('Welcome.linkFAQ')}
        </WelcomeExternalLink>
        <WelcomeExternalLink href={BUG_REPORTING_URL}>
          {translate('Navigation.linkBugReporting')}
        </WelcomeExternalLink>
        <WelcomeExternalLink href={EMAIL_URL}>
          {translate('Welcome.linkContactUs')}
        </WelcomeExternalLink>
        <WelcomeExternalLink href={PRIVACY_LEGAL_URL}>
          {translate('Welcome.linkPrivacyLegal')}
        </WelcomeExternalLink>
      </Box>
    </>
  );
};

const WelcomeExternalLink = ({ children, href }) => {
  const classes = useStyles();

  return (
    <ExternalLink
      className={classes.welcomeExternalLink}
      classes={{ root: 'body5_link' }}
      href={href}
      variant="body5"
    >
      {children}
    </ExternalLink>
  );
};

WelcomeExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default Welcome;
