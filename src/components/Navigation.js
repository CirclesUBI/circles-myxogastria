import { Box, Button, Drawer, Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { generatePath } from 'react-router-dom';

import {
  ACTIVITIES_PATH,
  MY_PROFILE_PATH,
  ORGANIZATION_PATH,
  SEARCH_PATH,
  SEED_PHRASE_PATH,
  SEND_PATH,
  SETTINGS_PATH,
  SHARE_PATH,
} from '~/routes';

import AvatarWithQR from '~/components/AvatarWithQR';
import ExternalLink from '~/components/ExternalLink';
{
  /* We temporary disable language switcher since languages are not there but should come soon */
}
// import LocaleSelector from '~/components/LocaleSelector';
import UsernameDisplay from '~/components/UsernameDisplay';
import translate from '~/services/locale';
import {
  IconFacebook,
  IconMail,
  IconTelegram,
  IconTwitter,
} from '~/styles/icons';
import {
  ABOUT_URL,
  EMAIL_URL,
  FACEBOOK_URL,
  FAQ_URL,
  MARKETPLACE_URL,
  PRIVACY_LEGAL_URL,
  TELEGRAM_URL,
  TWITTER_URL,
} from '~/utils/constants';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: theme.custom.components.navigationWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: theme.custom.components.navigationWidth,
    justifyContent: 'space-between',
  },
  navigationHeader: {
    paddingTop: theme.spacing(1.5),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    flex: 0,
  },
  navigationMain: {
    flex: 1,
  },
  navigationFooter: {
    padding: theme.spacing(3),
    background: theme.custom.gradients.purple,
  },
  navigationLink: {
    width: '100%',
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    justifyContent: 'flex-start',
    textTransform: 'none',
    color: theme.custom.colors.mineShaft,
  },
  navigationProfileLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  navigationExternalLink: {
    display: 'block',
    color: theme.palette.primary.contrastText,
  },
}));

const Navigation = ({ isExpanded, ...props }) => {
  const classes = useStyles();

  return (
    <Drawer
      anchor="left"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      open={isExpanded}
      {...props}
    >
      <NavigationHeader onClick={props.onClick} />
      <NavigationMain onClick={props.onClick} />
      <NavigationFooter />
    </Drawer>
  );
};

const NavigationHeader = ({ onClick }) => {
  const classes = useStyles();
  const safe = useSelector((state) => state.safe);

  return (
    <Box className={classes.navigationHeader} component="header">
      <Link
        className={classes.navigationProfileLink}
        to={MY_PROFILE_PATH}
        onClick={onClick}
      >
        <AvatarWithQR address={safe.currentAccount} />
        <Box mt={1.5}>
          <Typography variant="h2">
            <UsernameDisplay address={safe.currentAccount} />
          </Typography>
        </Box>
      </Link>
    </Box>
  );
};

const NavigationMain = ({ onClick }) => {
  const classes = useStyles();
  const safe = useSelector((state) => state.safe);

  return (
    <Box className={classes.navigationMain} component="main">
      <NavigationLink to={SEARCH_PATH} onClick={onClick}>
        {translate('Navigation.buttonDoublePeople')}
      </NavigationLink>
      <NavigationLink to={generatePath(SEND_PATH)} onClick={onClick}>
        {translate('Navigation.buttonSendCircles')}
      </NavigationLink>
      <NavigationLink to={ACTIVITIES_PATH} onClick={onClick}>
        {translate('Navigation.buttonActivityLog')}
      </NavigationLink>
      {!safe.isOrganization && (
        <NavigationLink to={ORGANIZATION_PATH} onClick={onClick}>
          {translate('Navigation.buttonOrganization')}
        </NavigationLink>
      )}
      <NavigationLink to={SHARE_PATH} onClick={onClick}>
        {translate('Navigation.buttonMyQR')}
      </NavigationLink>
      <NavigationLink to={SEED_PHRASE_PATH} onClick={onClick}>
        {translate('Navigation.buttonExportSeedPhrase')}
      </NavigationLink>
      <NavigationLink to={SETTINGS_PATH} onClick={onClick}>
        {translate('Navigation.buttonSettings')}
      </NavigationLink>
    </Box>
  );
};

const NavigationFooter = () => {
  const classes = useStyles();

  return (
    <Box className={classes.navigationFooter} component="footer">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <NavigationExternalLink href={MARKETPLACE_URL}>
            {translate('Navigation.linkMarketplace')}
          </NavigationExternalLink>
        </Grid>
        <Grid item xs={6}>
          <NavigationExternalLink href={ABOUT_URL}>
            {translate('Navigation.linkAbout')}
          </NavigationExternalLink>
        </Grid>
        <Grid item xs={6}>
          <NavigationExternalLink href={PRIVACY_LEGAL_URL}>
            {translate('Navigation.linkPrivacyLegal')}
          </NavigationExternalLink>
        </Grid>
        <Grid item xs={6}>
          <NavigationExternalLink href={FAQ_URL}>
            {translate('Navigation.linkFAQ')}
          </NavigationExternalLink>
        </Grid>
      </Grid>
      <Box mt={2} />
      <Grid alignItems="center" container spacing={2}>
        <Grid item xs={6}>
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <NavigationExternalLink href={TELEGRAM_URL}>
                <IconTelegram fontSize="small" />
              </NavigationExternalLink>
            </Grid>
            <Grid item xs={3}>
              <NavigationExternalLink href={FACEBOOK_URL}>
                <IconFacebook fontSize="small" />
              </NavigationExternalLink>
            </Grid>
            <Grid item xs={3}>
              <NavigationExternalLink href={TWITTER_URL}>
                <IconTwitter fontSize="small" />
              </NavigationExternalLink>
            </Grid>
            <Grid item xs={3}>
              <NavigationExternalLink href={EMAIL_URL}>
                <IconMail fontSize="small" />
              </NavigationExternalLink>
            </Grid>
          </Grid>
        </Grid>
        {/* We temporary disable language switcher since languages are not there but should come soon */}
        {/* <Grid item xs={6}>
          <LocaleSelector />
        </Grid> */}
      </Grid>
    </Box>
  );
};

const NavigationLink = ({ children, to }) => {
  const classes = useStyles();

  return (
    <Button
      classes={{
        root: classes.navigationLink,
      }}
      component={Link}
      to={to}
    >
      <Typography variant="h5">{children}</Typography>
    </Button>
  );
};

const NavigationExternalLink = ({ children, href }) => {
  const classes = useStyles();

  return (
    <ExternalLink className={classes.navigationExternalLink} href={href}>
      <Typography classes={{ root: 'body1_white' }} variant={'body1'}>
        {children}
      </Typography>
    </ExternalLink>
  );
};

Navigation.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

NavigationHeader.propTypes = {
  onClick: PropTypes.func.isRequired,
};

NavigationMain.propTypes = {
  onClick: PropTypes.func.isRequired,
};

NavigationLink.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

NavigationExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default React.memo(Navigation);
