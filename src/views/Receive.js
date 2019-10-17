import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import QRCode from '~/components/QRCode';
import RoundButton from '~/components/RoundButton';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import { BackgroundGreen } from '~/styles/Background';
import { IconShare } from '~/styles/Icons';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const Receive = (props, context) => {
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
      </Header>

      <View isHeader>
        <QRCode data={safe.address} />
        <p>{context.t('Receive.showThisQR')}</p>

        <RoundButton to="/receive/share">
          <IconShare />
          <span>{context.t('Receive.share')}</span>
        </RoundButton>
      </View>
    </BackgroundGreen>
  );
};

Receive.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Receive;
