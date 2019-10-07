import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ActionButton from '~/components/ActionButton';
import BalanceDisplay from '~/components/BalanceDisplay';
import Button from '~/components/Button';
import Footer from '~/components/Footer';
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

      <DashboardView />
    </Fragment>
  );
};

const DashboardView = (props, context) => {
  const { isTrusted } = useSelector(state => state.trust);
  const safe = useSelector(state => state.safe);

  if (!isTrusted) {
    return (
      <Fragment>
        <View>
          <TrustHealthDisplay />
          <h1>{context.t('Dashboard.welcomeToCircles')}</h1>
          <QRCode data={safe.address} width={200} />

          <p>
            {context.t('Dashboard.trustDescription')}{' '}
            <a href="#">{context.t('Dashboard.learnMore')}</a>
          </p>
        </View>

        <Footer>
          <Link to="/settings/share">
            <Button>{context.t('Dashboard.share')}</Button>
          </Link>
        </Footer>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <View>
        <TrustHealthDisplay />
        <TrustNetwork />
      </View>

      <ActionButton />
    </Fragment>
  );
};

DashboardView.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Dashboard;
