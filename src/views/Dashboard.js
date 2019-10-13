import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import ActionButton from '~/components/ActionButton';
import BalanceDisplay from '~/components/BalanceDisplay';
import Button from '~/components/Button';
import ButtonPrimary from '~/components/ButtonPrimary';
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
        <Button to="/settings">
          <QRCode data={safe.address} scale={1} width={30} />
        </Button>

        <BalanceDisplay />

        <Button to="/activities">0</Button>
      </Header>

      <DashboardView />
    </Fragment>
  );
};

const DashboardView = (props, context) => {
  const safe = useSelector(state => state.safe);

  if (safe.nonce) {
    return (
      <Fragment>
        <View>
          <TrustHealthDisplay />
          <h1>{context.t('Dashboard.welcomeToCircles')}</h1>
          <QRCode data={safe.address} width={250} />

          <p>
            {context.t('Dashboard.trustDescription')}{' '}
            <a href="#">{context.t('Dashboard.learnMore')}</a>
          </p>
        </View>

        <Footer>
          <ButtonPrimary to="/receive">
            {context.t('Dashboard.share')}
          </ButtonPrimary>
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
