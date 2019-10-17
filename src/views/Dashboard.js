import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import ActionButton from '~/components/ActionButton';
import BalanceDisplay from '~/components/BalanceDisplay';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import HeaderButton from '~/components/HeaderButton';
import QRCode from '~/components/QRCode';
import TrustHealthDisplay from '~/components/TrustHealthDisplay';
import TrustNetwork from '~/components/TrustNetwork';
import View from '~/components/View';
import styles from '~/styles/variables';
import { IconQR, IconActivities } from '~/styles/Icons';

import background from '%/images/background-whirly-orange.svg';

const Dashboard = () => {
  return (
    <BackgroundStyle>
      <Header>
        <HeaderButton to="/settings">
          <IconQR />
        </HeaderButton>

        <BalanceDisplay />

        <HeaderButton to="/activities">
          <IconActivities />
          <DashboardActivityCounter count={12} />
        </HeaderButton>
      </Header>

      <DashboardView />
    </BackgroundStyle>
  );
};

const DashboardView = (props, context) => {
  const safe = useSelector(state => state.safe);

  if (safe.nonce) {
    return (
      <Fragment>
        <View isFooter isHeader>
          <TrustHealthDisplay />
          <h1>{context.t('Dashboard.welcomeToCircles')}</h1>
          <QRCode data={safe.address} />

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
      <View isHeader>
        <TrustHealthDisplay />
        <TrustNetwork />
      </View>

      <ActionButton />
    </Fragment>
  );
};

const DashboardActivityCounter = props => {
  if (props.count === 0) {
    return null;
  }

  return (
    <ActivityCounterStyle>
      <span>{props.count}</span>
    </ActivityCounterStyle>
  );
};

DashboardView.contextTypes = {
  t: PropTypes.func.isRequired,
};

DashboardActivityCounter.propTypes = {
  count: PropTypes.number.isRequired,
};

const BackgroundStyle = styled.div`
  height: 100%;

  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: contain;
`;

const ActivityCounterStyle = styled.div`
  position: absolute;

  top: 3rem;
  right: 0;

  width: 2rem;
  height: 2rem;

  border: 1px solid ${styles.monochrome.white};
  border-radius: 50%;

  line-height: 0;

  span {
    position: relative;

    top: 6px;

    color: ${styles.monochrome.white};

    font-weight: ${styles.base.typography.weightBold};
    font-size: 0.6em;

    text-align: center;
  }
`;

export default Dashboard;
