import { Box, CircularProgress, Typography } from '@material-ui/core';
import React, { Fragment } from 'react';

import AppNote from '~/components/AppNote';
import Footer from '~/components/Footer';
import Logo from '~/components/Logo';
import View from '~/components/View';
import translate from '~/services/locale';

const ValidationLock = () => {
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
      </View>
      <Footer>
        <AppNote messageVersion="validation" />
        <Box my={2}>
          <Typography align="center">
            {translate('ValidationLock.bodyThisMayTakeMinutes')}
          </Typography>
        </Box>
      </Footer>
    </Fragment>
  );
};

export default ValidationLock;
