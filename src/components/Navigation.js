import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  SwipeableDrawer,
  Grid,
  Button,
  Box,
} from '@material-ui/core';
import { generatePath } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import AvatarWithQR from '~/components/AvatarWithQR';
import ExternalLink from '~/components/ExternalLink';
import LocaleSelector from '~/components/LocaleSelector';
import UsernameDisplay from '~/components/UsernameDisplay';
import translate from '~/services/locale';
import {
  ACTIVITIES_PATH,
  MY_PROFILE_PATH,
  SEED_PHRASE_PATH,
  SEND_PATH,
  SETTINGS_PATH,
  SHARE_PATH,
} from '~/routes';
import {
  ABOUT_URL,
  FAQ_URL,
  MARKETPLACE_URL,
  PRIVACY_LEGAL_URL,
  SUPPORT_URL,
  EMAIL_URL,
  FACEBOOK_URL,
  TWITTER_URL,
  TELEGRAM_URL,
} from '~/utils/constants';
import {
  IconFacebook,
  IconMail,
  IconTelegram,
  IconTwitter,
} from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  drawer: {
    // width: theme.custom.components.navigationWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: theme.custom.components.navigationWidth,
    maxWidth: `calc(100% - 48px)`,
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
  },
  navigationProfileLink: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
  },
  navigationExternalLink: {
    display: 'block',
    color: theme.palette.primary.contrastText,
  },
  navigationLinkLabel: {
    textTransform: 'initial',
    fontWeight: theme.typography.fontWeightLight,
  },
}));

const Navigation = ({ onOpen, onClose, open, authorized, verified }) => {
  const classes = useStyles();

  return (
    <SwipeableDrawer
      classes={{ paper: classes.drawerPaper }}
      open={open}
      onClose={onClose}
      onOpen={onOpen}
    >
      <NavigationHeader
        authorized={authorized}
        verified={verified}
        onClick={onClose}
      />
      <NavigationMain
        authorized={authorized}
        verified={verified}
        onClick={onClose}
      />
      <NavigationFooter authorized={authorized} verified={verified} />
    </SwipeableDrawer>
  );
};

const NavigationHeader = ({ onClick, authorized, verified }) => {
  const classes = useStyles();
  const safe = useSelector((state) => state.safe);

  return (
    <Box className={classes.navigationHeader} component="header">
      <Link
        className={classes.navigationProfileLink}
        to={MY_PROFILE_PATH}
        onClick={onClick}
      >
        <AvatarWithQR address={safe.currentAccount || safe.pendingAddress} />
        <Box mt={1.5}>
          <Typography variant="h6">
            <UsernameDisplay
              address={safe.currentAccount || safe.pendingAddress}
            />
          </Typography>
        </Box>
      </Link>
    </Box>
  );
};

const NavigationMain = ({ onClick, authorized, verified }) => {
  const classes = useStyles();

  return (
    <Box className={classes.navigationMain} component="main">
      <NavigationLink to={SHARE_PATH} onClick={onClick}>
        {translate('Navigation.buttonMyQR')}
      </NavigationLink>
      <NavigationLink to={ACTIVITIES_PATH} onClick={onClick}>
        {translate('Navigation.buttonActivityLog')}
      </NavigationLink>
      <NavigationLink to={generatePath(SEND_PATH)} onClick={onClick}>
        {translate('Navigation.buttonSendCircles')}
      </NavigationLink>
      <NavigationLink to={SETTINGS_PATH} onClick={onClick}>
        {translate('Navigation.buttonAddDevice')}
      </NavigationLink>
      <NavigationLink to={SEED_PHRASE_PATH} onClick={onClick}>
        {translate('Navigation.buttonExportSeedPhrase')}
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
          <NavigationExternalLink href={SUPPORT_URL}>
            {translate('Navigation.linkSupport')}
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
        <Grid item xs={6}>
          <LocaleSelector />
        </Grid>
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
        label: classes.navigationLinkLabel,
      }}
      component={Link}
      to={to}
    >
      {children}
    </Button>
  );
};

const NavigationExternalLink = ({ children, href }) => {
  const classes = useStyles();

  return (
    <ExternalLink className={classes.navigationExternalLink} href={href}>
      {children}
    </ExternalLink>
  );
};

Navigation.propTypes = {
  authorized: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  verified: PropTypes.bool,
};

NavigationHeader.propTypes = {
  authorized: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  verified: PropTypes.bool,
};

NavigationMain.propTypes = {
  authorized: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  verified: PropTypes.bool,
};

NavigationLink.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string.isRequired,
};

NavigationExternalLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default Navigation;
