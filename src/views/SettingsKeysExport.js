import React, { Fragment, useState, useEffect } from 'react';

import ButtonHome from '~/components/ButtonHome';
import Header from '~/components/Header';
import ShareTextBox from '~/components/ShareTextBox';
import View from '~/components/View';
import translate from '~/services/locale';
import { toSeedPhrase, getPrivateKey } from '~/services/wallet';

const SettingsKeysExport = () => {
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
        {translate('SettingsKeysExport.exportSeedPhrase')}
        <ButtonHome />
      </Header>

      <View>
        <p>{translate('SettingsKeysExport.description')}</p>
        <ShareTextBox isClipboard text={mnemonic} />
      </View>
    </Fragment>
  );
};

export default SettingsKeysExport;
