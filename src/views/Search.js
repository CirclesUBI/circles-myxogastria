import React, { Fragment, useState } from 'react';
import { Container } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { generatePath } from 'react-router';

import ButtonBack from '~/components/ButtonBack';
import ButtonQRCodeScanner from '~/components/ButtonQRCodeScanner';
import CenteredHeading from '~/components/CenteredHeading';
import Finder from '~/components/Finder';
import Header from '~/components/Header';
import View from '~/components/View';
import translate from '~/services/locale';
import { PROFILE_PATH } from '~/routes';

const Search = () => {
  const [redirectPath, setRedirectPath] = useState(null);

  const handleSelect = (address) => {
    setRedirectPath(
      generatePath(PROFILE_PATH, {
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
        <CenteredHeading>{translate('Search.headingSearch')}</CenteredHeading>
        <ButtonQRCodeScanner edge="end" onSelect={handleSelect} />
      </Header>
      <View>
        <Container maxWidth="sm">
          <Finder hasActions onSelect={handleSelect} />
        </Container>
      </View>
    </Fragment>
  );
};

export default Search;
