import React, { Fragment, useState, useEffect } from 'react';

import BackButton from '~/components/BackButton';
import { toSeedPhrase, getPrivateKey } from '~/services/wallet';

const SettingsExport = () => {
  const [mnemonic, setMnemonic] = useState('');

  const generateMnemonic = () => {
    const privateKey = getPrivateKey();
    const seedPhrase = toSeedPhrase(privateKey);

    setMnemonic(seedPhrase);
  };

  useEffect(generateMnemonic, []);

  return (
    <Fragment>
      <BackButton />
      <textarea readOnly value={mnemonic} />
    </Fragment>
  );
};

export default SettingsExport;
