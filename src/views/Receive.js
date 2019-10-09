import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';
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
        <QRCode data={safe.address} width={250} />
        <p>{context.t('Receive.showThisQR')}</p>
      </View>

      <Footer>
        <Link to="/receive/share">
          <Button>{context.t('Receive.share')}</Button>
        </Link>
      </Footer>
    </Fragment>
  );
};

Receive.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Receive;
