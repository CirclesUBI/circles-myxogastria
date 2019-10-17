import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import ExternalLinkList from '~/components/ExternalLinkList';
import HeaderButton from '~/components/HeaderButton';
import LocaleSelector from '~/components/LocaleSelector';
import QRCode from '~/components/QRCode';
import RoundButton from '~/components/RoundButton';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import { BackgroundGreen } from '~/styles/Background';
import { IconKeys, IconShare } from '~/styles/Icons';
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
        <BackButton to="/" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>
            <UsernameDisplay address={safe.address} />
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <HeaderButton to="/settings/keys">
          <IconKeys />
        </HeaderButton>
      </Header>

      <View isHeader>
        <SpacingStyle>
          <QRCode data={safe.address} />
        </SpacingStyle>

        <SpacingStyle>
          <p>{context.t('Settings.showThisQR')}</p>
        </SpacingStyle>

        <RoundButton to="/settings/share">
          <IconShare />
          <span>{context.t('Settings.share')}</span>
        </RoundButton>

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
