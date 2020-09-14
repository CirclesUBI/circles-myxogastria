import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import ExternalLinkList from '~/components/ExternalLinkList';
import Header from '~/components/Header';
import LocaleSelector from '~/components/LocaleSelector';
import QRCode from '~/components/QRCode';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import translate from '~/services/locale';
import { SpacingStyle } from '~/styles/Layout';

const Settings = () => {
  const safe = useSelector((state) => state.safe);

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/" />
        <UsernameDisplay address={safe.currentAccount} />
      </Header>
      <View>
        <SpacingStyle>
          <QRCode data={safe.currentAccount} />
        </SpacingStyle>
        <SpacingStyle>
          <p>{translate('Settings.showThisQR')}</p>
        </SpacingStyle>
        <Button to="/settings/share">
          <span>{translate('Settings.share')}</span>
        </Button>
        <SpacingStyle>
          <LocaleSelector />
        </SpacingStyle>
        <ExternalLinkList />
      </View>
    </Fragment>
  );
};

export default Settings;
