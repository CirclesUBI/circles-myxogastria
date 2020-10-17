import React, { Fragment } from 'react';
import { Container } from '@material-ui/core';

import ActivityStreamWithTabs from '~/components/ActivityStreamWithTabs';
import ButtonBack from '~/components/ButtonBack';
import CenteredHeading from '~/components/CenteredHeading';
import Header from '~/components/Header';
import View from '~/components/View';
import translate from '~/services/locale';

const Activities = () => {
  return (
    <Fragment>
      <Header>
        <ButtonBack />
        <CenteredHeading>
          {translate('Activities.headingActivityLog')}
        </CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <ActivityStreamWithTabs />
        </Container>
      </View>
    </Fragment>
  );
};

export default Activities;
