import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ExternalLinkList from '~/components/ExternalLinkList';
import ButtonHeader from '~/components/ButtonHeader';
import LocaleSelector from '~/components/LocaleSelector';
import QRCode from '~/components/QRCode';
import ButtonRound from '~/components/ButtonRound';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import { BackgroundGreen } from '~/styles/Background';
import { IconDevices, IconShare } from '~/styles/Icons';
import { SpacingStyle } from '~/styles/Layout';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const Settings = (props, context) => {
  const safe = useSelector(state => state.safe);

  return (
    <BackgroundGreen>
      <Header>
        <ButtonBack to="/" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>
            <UsernameDisplay address={safe.address} />
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <ButtonHeader to="/settings/keys">
          <IconDevices />
        </ButtonHeader>
      </Header>

      <View isHeader>
        <SpacingStyle>
          <QRCode data={safe.address} />
        </SpacingStyle>

        <SpacingStyle>
          <p>{context.t('Settings.showThisQR')}</p>
        </SpacingStyle>

        <ButtonRound to="/settings/share">
          <IconShare />
          <span>{context.t('Settings.share')}</span>
        </ButtonRound>

        <SpacingStyle>
          <LocaleSelector />
        </SpacingStyle>

        <ExternalLinkList />
      </View>
    </BackgroundGreen>
  );
};

Settings.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Settings;
