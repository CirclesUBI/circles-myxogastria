import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';
import Header from '~/components/Header';
import QRCode from '~/components/QRCode';
import View from '~/components/View';

const AccountConnect = (props, context) => {
  const { address } = useSelector(state => state.wallet);

  return (
    <Fragment>
      <Header>
        <BackButton to="/welcome" />
      </Header>

      <View>
        <QRCode data={address} width={250} />

        <Link to="/welcome/seed">
          <Button>{context.t('views.connect.seed')}</Button>
        </Link>
      </View>
    </Fragment>
  );
};

AccountConnect.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default AccountConnect;
