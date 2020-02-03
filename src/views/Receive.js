import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import QRCode from '~/components/QRCode';
import ButtonRound from '~/components/ButtonRound';
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
        <ButtonBack to="/" />

        <HeaderCenterStyle>
          <HeaderTitleStyle>
            <UsernameDisplay address={safe.address} />
          </HeaderTitleStyle>
        </HeaderCenterStyle>
      </Header>

      <View isHeader>
        <QRCode data={safe.address} />
        <p>{context.t('Receive.showThisQR')}</p>

        <ButtonRound to="/receive/share">
          <IconShare />
          <span>{context.t('Receive.share')}</span>
        </ButtonRound>
      </View>
    </BackgroundGreen>
  );
};

Receive.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Receive;
