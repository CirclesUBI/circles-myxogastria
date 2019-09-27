import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ActionButton from '~/components/ActionButton';
import BalanceDisplay from '~/components/BalanceDisplay';
import Button from '~/components/Button';
import Header from '~/components/Header';
import QRCode from '~/components/QRCode';
import TrustHealthDisplay from '~/components/TrustHealthDisplay';
import TrustNetwork from '~/components/TrustNetwork';
import View from '~/components/View';

const Dashboard = () => {
  const safe = useSelector(state => state.safe);

  return (
    <Fragment>
      <Header>
        <Link to="/settings">
          <Button>
            <QRCode data={safe.address} scale={1} width={30} />
          </Button>
        </Link>

        <BalanceDisplay />

        <Link to="/activities">
          <Button>0</Button>
        </Link>
      </Header>

      <View>
        <TrustHealthDisplay />
        <TrustNetwork />
      </View>

      <ActionButton />
    </Fragment>
  );
};

Dashboard.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Dashboard;
