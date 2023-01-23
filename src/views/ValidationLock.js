import { Box, CircularProgress, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { Fragment } from 'react';

import AppNote from '~/components/AppNote';
import HumbleAlert from '~/components/HumbleAlert';
import Logo from '~/components/Logo';
import View from '~/components/View';
import translate from '~/services/locale';
import { colors } from '~/styles/theme';

const useStyles = makeStyles(() => ({
  boxInfoContainer: {
    marginTop: '80px',
    padding: '16px',
  },
}));

const ValidationLock = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <View>
        <Box mb={4} mt={10} mx="auto">
          <Logo />
        </Box>
        <Typography align="center" gutterBottom variant="h6">
          {translate('ValidationLock.bodyYourCirclesLoading')}
        </Typography>
        <Box align="center" mt={2}>
          <CircularProgress />
        </Box>
        <Box className={classes.boxInfoContainer}>
          <AppNote messageVersion="validation" />
          {!process.env.USER_NOTIFICATION_VALIDATION && (
            <HumbleAlert
              color={colors.fountainBlueLighter}
              icon="IconBrowser"
              iconColor={colors.whiteAlmost}
            >
              {translate('ValidationLock.bodyThisMayTakeMinutes')}
            </HumbleAlert>
          )}
        </Box>
      </View>
    </Fragment>
  );
};

export default ValidationLock;
