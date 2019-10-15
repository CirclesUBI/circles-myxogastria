import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import QRCode from '~/components/QRCode';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';

const Receive = (props, context) => {
  const safe = useSelector(state => state.safe);

  return (
    <Fragment>
      <Header>
        <BackButton to="/" />
      </Header>

      <View>
        <UsernameDisplay address={safe.address} />
        <QRCode data={safe.address} />
        <p>{context.t('Receive.showThisQR')}</p>
      </View>

      <Footer>
        <ButtonPrimary to="/receive/share">
          {context.t('Receive.share')}
        </ButtonPrimary>
      </Footer>
    </Fragment>
  );
};

Receive.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Receive;
