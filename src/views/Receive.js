import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonRound from '~/components/ButtonRound';
import QRCode from '~/components/QRCode';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import { BackgroundGreenTop } from '~/styles/Background';
import { IconShare } from '~/styles/Icons';
import { SpacingStyle } from '~/styles/Layout';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const Receive = (props, context) => {
  const safe = useSelector((state) => state.safe);

  return (
    <BackgroundGreenTop>
      <Header>
        <ButtonBack to="/" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>
            <UsernameDisplay address={safe.address} />
          </HeaderTitleStyle>
        </HeaderCenterStyle>
      </Header>

      <View isHeader>
        <QRCode data={safe.address} />

        <SpacingStyle>
          <p>{context.t('Receive.showThisQR')}</p>
        </SpacingStyle>

        <ButtonRound to="/receive/share">
          <IconShare />
          <span>{context.t('Receive.share')}</span>
        </ButtonRound>
      </View>
    </BackgroundGreenTop>
  );
};

Receive.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Receive;
