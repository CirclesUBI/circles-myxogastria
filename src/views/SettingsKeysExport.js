import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';

import BackButton from '~/components/BackButton';
import HomeButton from '~/components/HomeButton';
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
        <BackButton isDark to="/settings/keys" />

        <HeaderCenterStyle>
          <HeaderTitleStyle isDark>
            {context.t('SettingsKeysExport.exportSeedPhrase')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <HomeButton isDark />
      </Header>

      <View isHeader>
        <p>{context.t('SettingsKeysExport.description')}</p>
        <ShareTextBox text={mnemonic} />
      </View>
    </Fragment>
  );
};

SettingsKeysExport.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsKeysExport;
