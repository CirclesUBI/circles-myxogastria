import { Container, Typography } from '@material-ui/core';
import React, { Fragment } from 'react';

import ButtonHome from '~/components/ButtonHome';
import CenteredHeading from '~/components/CenteredHeading';
import Header from '~/components/Header';
import View from '~/components/View';
import translate from '~/services/locale';

const NotFound = () => {
  return (
    <Fragment>
      <Header>
        <ButtonHome />
        <CenteredHeading>
          {translate('NotFound.headingNotFound')}
        </CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <Typography align="center">
            {translate('NotFound.bodyNotFound')}
          </Typography>
        </Container>
      </View>
    </Fragment>
  );
};

export default NotFound;
