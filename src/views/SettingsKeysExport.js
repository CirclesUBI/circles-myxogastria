import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import ButtonHome from '~/components/ButtonHome';
import Header from '~/components/Header';
import ShareTextBox from '~/components/ShareTextBox';
import View from '~/components/View';
import { BackgroundGreenTop } from '~/styles/Background';
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
    <BackgroundGreenTop>
      <Header>
        {context.t('SettingsKeysExport.exportSeedPhrase')}
        <ButtonHome />
      </Header>

      <View>
        <p>{context.t('SettingsKeysExport.description')}</p>
        <ShareTextBox isClipboard text={mnemonic} />
      </View>
    </BackgroundGreenTop>
  );
};

SettingsKeysExport.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsKeysExport;
