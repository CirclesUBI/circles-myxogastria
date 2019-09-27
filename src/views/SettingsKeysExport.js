import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';

import BackButton from '~/components/BackButton';
import ClipboardButton from '~/components/ClipboardButton';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';
import { toSeedPhrase, getPrivateKey } from '~/services/wallet';

const SettingsKeysExport = (props, context) => {
  const [mnemonic, setMnemonic] = useState('');

  const generateMnemonic = () => {
    const privateKey = getPrivateKey();
    const seedPhrase = toSeedPhrase(privateKey);

    setMnemonic(seedPhrase);
  };

  useEffect(generateMnemonic, []);

  return (
    <Fragment>
      <Header>
        <BackButton to="/settings/keys" />
      </Header>

      <View>
        <textarea readOnly value={mnemonic} />
      </View>

      <Footer>
        <ClipboardButton text={mnemonic}>
          {context.t('views.settings.clipboard')}
        </ClipboardButton>
      </Footer>
    </Fragment>
  );
};

SettingsKeysExport.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsKeysExport;
