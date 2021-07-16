import { Container } from '@material-ui/core';
import React, { Fragment, useState } from 'react';
import { generatePath } from 'react-router';
import { Redirect } from 'react-router-dom';

import { SEND_CONFIRM_PATH, SEND_PATH } from '~/routes';

import ButtonBack from '~/components/ButtonBack';
import ButtonQRCodeScanner from '~/components/ButtonQRCodeScanner';
import CenteredHeading from '~/components/CenteredHeading';
import Finder from '~/components/Finder';
import Header from '~/components/Header';
import View from '~/components/View';
import translate from '~/services/locale';

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
        <ButtonQRCodeScanner edge="end" onSelect={handleSelect} />
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
