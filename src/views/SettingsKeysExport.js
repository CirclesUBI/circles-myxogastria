import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import ShareTextBox from '~/components/ShareTextBox';
import View from '~/components/View';
import { BackgroundGreen } from '~/styles/Background';
import { toSeedPhrase, getPrivateKey } from '~/services/wallet';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const SettingsKeysExport = (props, context) => {
  const [mnemonic, setMnemonic] = useState('');

  const generateMnemonic = () => {
    const privateKey = getPrivateKey();
    const seedPhrase = toSeedPhrase(privateKey);

    setMnemonic(seedPhrase);
  };

  useEffect(generateMnemonic, []);

  return (
    <BackgroundGreen>
      <Header>
        <ButtonBack to="/settings/keys" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>
            {context.t('SettingsKeysExport.exportSeedPhrase')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <ButtonHome />
      </Header>

      <View isHeader>
        <p>{context.t('SettingsKeysExport.description')}</p>
        <ShareTextBox isClipboard text={mnemonic} />
      </View>
    </BackgroundGreen>
  );
};

SettingsKeysExport.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsKeysExport;
