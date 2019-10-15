import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import ActionButton from '~/components/ActionButton';
import BalanceDisplay from '~/components/BalanceDisplay';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import QRCode from '~/components/QRCode';
import TrustHealthDisplay from '~/components/TrustHealthDisplay';
import TrustNetwork from '~/components/TrustNetwork';
import View from '~/components/View';
import styles from '~/styles/variables';
import { ButtonStyle } from '~/components/Button';
import { IconQR, IconActivities } from '~/styles/Icons';

import backgroundHome from '~/../assets/images/background-home.svg';

const Dashboard = () => {
  return (
    <BackgroundStyle>
      <Header>
        <HeaderButtonStyle to="/settings">
          <IconQR />
        </HeaderButtonStyle>

        <BalanceDisplay />

        <HeaderButtonStyle to="/activities">
          <IconActivities />
          <DashboardActivityCounter count={12} />
        </HeaderButtonStyle>
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

  background-image: url(${backgroundHome});
  background-size: cover;
`;

const HeaderButtonStyle = styled(ButtonStyle)`
  position: relative;

  padding: 1.5rem;
  padding-right: 2rem;
  padding-left: 2rem;

  color: ${styles.components.button.color};

  font-size: 2.5em;
`;

const ActivityCounterStyle = styled.div`
  position: absolute;

  top: 4rem;
  left: 0;

  width: 2rem;
  height: 2rem;

  border: 1px solid ${styles.monochrome.white};
  border-radius: 50%;

  color: ${styles.monochrome.white};

  font-weight: ${styles.base.typography.weightBold};
  font-size: 0.3em;

  span {
    position: relative;

    top: 3px;

    text-align: center;
  }
`;

export default Dashboard;
