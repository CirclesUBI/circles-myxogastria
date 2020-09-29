import React, { Fragment, useState } from 'react';
import { Container } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { generatePath } from 'react-router';

import ButtonBack from '~/components/ButtonBack';
import Finder from '~/components/Finder';
import Header from '~/components/Header';
import View from '~/components/View';
import translate from '~/services/locale';
import CenteredHeading from '~/components/CenteredHeading';
import { SEND_PATH, SEND_CONFIRM_PATH } from '~/routes';

const Send = () => {
  const [redirectPath, setRedirectPath] = useState(null);

  const handleSelect = (address) => {
    setRedirectPath(
      generatePath(SEND_CONFIRM_PATH, {
        address,
      }),
    );
  };

  if (redirectPath) {
    return <Redirect push to={redirectPath} />;
  }

  return (
    <Fragment>
      <Header>
        <ButtonBack />
        <CenteredHeading>
          {translate('Send.headingSendCircles')}
        </CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <Finder basePath={SEND_PATH} onSelect={handleSelect} />
        </Container>
      </View>
    </Fragment>
  );
};

export default Send;
