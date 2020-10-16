import React, { Fragment } from 'react';
import { Avatar, Box, Container, Tooltip, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

import AvatarWithQR from '~/components/AvatarWithQR';
import BalanceDisplay from '~/components/BalanceDisplay';
import Button from '~/components/Button';
import CenteredHeading from '~/components/CenteredHeading';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import HumbleAlert from '~/components/HumbleAlert';
import UsernameDisplay from '~/components/UsernameDisplay';
import ValidationStatus from '~/components/ValidationStatus';
import View from '~/components/View';
import translate from '~/services/locale';
import { IconCheck } from '~/styles/icons';
import { NEEDED_TRUST_CONNECTIONS } from '~/utils/constants';
import { VALIDATION_SHARE_PATH } from '~/routes';

const useStyles = makeStyles((theme) => ({
  leftTrustConnections: {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const Validation = () => {
  const classes = useStyles();
  const { trust, safe, token } = useSelector((state) => state);

  const leftTrustConnections = Math.max(
    0,
    NEEDED_TRUST_CONNECTIONS - trust.connections,
  );

  const isDeploymentReady =
    safe.pendingIsFunded || token.isFunded || trust.isTrusted;

  return (
    <Fragment>
      <Header>
        <Link to={VALIDATION_SHARE_PATH}>
          <AvatarWithQR address={safe.pendingAddress} />
        </Link>
        <CenteredHeading>
          <UsernameDisplay address={safe.pendingAddress} />
        </CenteredHeading>
        <Tooltip
          arrow
          title={translate('Validation.tooltipLeftTrustConnections', {
            connections: leftTrustConnections,
          })}
        >
          <Avatar className={classes.leftTrustConnections}>
            {isDeploymentReady ? <IconCheck /> : leftTrustConnections}
          </Avatar>
        </Tooltip>
      </Header>
      <View>
        <Container maxWidth="sm">
          <Box mb={6} mt={2}>
            <BalanceDisplay />
          </Box>
          <Typography align="center" variant="h2">
            {translate('Validation.headingBuildYourWebOfTrust')}
          </Typography>
          <ValidationStatus />
        </Container>
      </View>
      <Footer>
        <HumbleAlert>{translate('Validation.bodyDoNotReset')}</HumbleAlert>
        {!isDeploymentReady && (
          <Box mt={2}>
            <Button fullWidth isPrimary to={VALIDATION_SHARE_PATH}>
              {translate('Validation.buttonShareProfileLink')}
            </Button>
          </Box>
        )}
      </Footer>
    </Fragment>
  );
};

export default Validation;
