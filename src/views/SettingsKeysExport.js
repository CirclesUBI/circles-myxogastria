import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';

import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import ShareTextBox from '~/components/ShareTextBox';
import View from '~/components/View';
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
    <Fragment>
      <Header>
        <ButtonBack isDark to="/settings/keys" />

        <HeaderCenterStyle>
          <HeaderTitleStyle isDark>
            {context.t('SettingsKeysExport.exportSeedPhrase')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <ButtonHome isDark />
      </Header>

      <View isHeader>
        <p>{context.t('SettingsKeysExport.description')}</p>
        <ShareTextBox isClipboard text={mnemonic} />
      </View>
    </Fragment>
  );
};

SettingsKeysExport.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsKeysExport;
