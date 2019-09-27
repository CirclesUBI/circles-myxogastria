import React, { Fragment, useState, useEffect } from 'react';

import BackButton from '~/components/BackButton';
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
      <BackButton to="/settings/keys" />
      <textarea readOnly value={mnemonic} />
    </Fragment>
  );
};

export default SettingsKeysExport;
