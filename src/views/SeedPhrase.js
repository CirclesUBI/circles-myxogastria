import { Container, Typography } from '@material-ui/core';
import React, { Fragment, useMemo } from 'react';

import ButtonBack from '~/components/ButtonBack';
import ButtonClipboard from '~/components/ButtonClipboard';
import CenteredHeading from '~/components/CenteredHeading';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import Mnemonic from '~/components/Mnemonic';
import View from '~/components/View';
import translate from '~/services/locale';
import { getPrivateKey, toSeedPhrase } from '~/services/wallet';

const SeedPhrase = () => {
  const mnemonic = useMemo(() => {
    const privateKey = getPrivateKey();
    return toSeedPhrase(privateKey);
  }, []);

  return (
    <Fragment>
      <Header>
        <ButtonBack />
        <CenteredHeading>
          {translate('SeedPhrase.headingExportSeedPhrase')}
        </CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <Typography align="center" gutterBottom>
            {translate('SeedPhrase.bodyDescription')}
          </Typography>
          <Mnemonic text={mnemonic} />
        </Container>
      </View>
      <Footer>
        <ButtonClipboard fullWidth isPrimary text={mnemonic}>
          {translate('SeedPhrase.buttonCopyToClipboard')}
        </ButtonClipboard>
      </Footer>
    </Fragment>
  );
};

export default SeedPhrase;
