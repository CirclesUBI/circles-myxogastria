import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import ButtonAction from '~/components/ButtonAction';
import BalanceDisplay from '~/components/BalanceDisplay';
import Header from '~/components/Header';
import ButtonHeader from '~/components/ButtonHeader';
import Logo from '~/components/Logo';
import QRCode from '~/components/QRCode';
import ButtonRound from '~/components/ButtonRound';
import Spinner from '~/components/Spinner';
import TrustNetwork from '~/components/TrustNetwork';
import View from '~/components/View';
import styles from '~/styles/variables';
import { BackgroundWhirlyOrange } from '~/styles/Background';
import { IconQR, IconShare, IconActivities } from '~/styles/Icons';
import { SpacingStyle } from '~/styles/Layout';

const Dashboard = () => {
  const safe = useSelector(state => state.safe);

  // We consider someone "trusted" when Safe got deployed
  const isTrusted = !safe.nonce;

  return (
    <BackgroundWhirlyOrange>
      <Header>
        <ButtonHeader to="/settings">
          <IconQR />
        </ButtonHeader>

        <BalanceDisplay />

        <ButtonHeader to="/activities">
          <DashboardActivityIcon />
        </ButtonHeader>
      </Header>

      <DashboardView isTrusted={isTrusted} />
    </BackgroundWhirlyOrange>
  );
};

const DashboardActivityIcon = () => {
  const { activities, lastSeen } = useSelector(state => {
    return state.activity;
  });

  // Is there any pending transactions?
  const isPending =
    activities.findIndex(activity => {
      return activity.isPending;
    }) > -1;

  if (isPending) {
    return <Spinner />;
  }

  // Count how many activities we haven't seen yet
  const count = activities.reduce((acc, activity) => {
    if (activity.timestamp > lastSeen) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return (
    <Fragment>
      <IconActivities />
      <DashboardActivityCounter count={count} />
    </Fragment>
  );
};

const DashboardView = (props, context) => {
  const safe = useSelector(state => state.safe);

  if (!props.isTrusted) {
    return (
      <Fragment>
        <View isHeader>
          <SpacingStyle>
            <Logo />
          </SpacingStyle>

          <SpacingStyle isLargeTop>
            <h1>{context.t('Dashboard.welcomeToCircles')}</h1>
          </SpacingStyle>

          <p>
            {context.t('Dashboard.trustDescription')}{' '}
            <a
              href="https://docs.google.com/document/d/1MS6IxQ3baMx_PJLJZ_KWpZYKHUKQ1JFkU4wHOW0P6OU/edit"
              rel="noopener noreferrer"
              target="_blank"
            >
              {context.t('Dashboard.learnMore')}
            </a>
          </p>

          <SpacingStyle>
            <QRCode data={safe.address} />
          </SpacingStyle>

          <SpacingStyle>
            <p>{context.t('Dashboard.showThisQR')}</p>
          </SpacingStyle>

          <SpacingStyle>
            <ButtonRound to="/invite">
              <IconShare />
              <span>{context.t('Dashboard.share')}</span>
            </ButtonRound>
          </SpacingStyle>
        </View>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <View isHeader>
        <Logo isWithGang />
        <TrustNetwork />
      </View>

      <ButtonAction />
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

DashboardView.propTypes = {
  isTrusted: PropTypes.bool.isRequired,
};

DashboardView.contextTypes = {
  t: PropTypes.func.isRequired,
};

DashboardActivityCounter.propTypes = {
  count: PropTypes.number.isRequired,
};

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
