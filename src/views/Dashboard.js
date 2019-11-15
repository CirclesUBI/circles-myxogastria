import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import ActionButton from '~/components/ActionButton';
import BalanceDisplay from '~/components/BalanceDisplay';
import Header from '~/components/Header';
import HeaderButton from '~/components/HeaderButton';
import QRCode from '~/components/QRCode';
import RoundButton from '~/components/RoundButton';
import TrustHealthDisplay from '~/components/TrustHealthDisplay';
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

  // @TODO: Show unread / pending transactions or notifications count
  const count = 0;

  return (
    <BackgroundWhirlyOrange>
      <Header>
        <HeaderButton to="/settings">
          <IconQR />
        </HeaderButton>

        <BalanceDisplay />

        <HeaderButton to="/activities">
          <IconActivities />
          <DashboardActivityCounter count={count} />
        </HeaderButton>
      </Header>

      <DashboardView isTrusted={isTrusted} />
    </BackgroundWhirlyOrange>
  );
};

const DashboardView = (props, context) => {
  const safe = useSelector(state => state.safe);

  if (!props.isTrusted) {
    return (
      <Fragment>
        <View isHeader>
          <SpacingStyle>
            <TrustHealthDisplay isTrusted={false} />
          </SpacingStyle>

          <SpacingStyle>
            <h1>{context.t('Dashboard.welcomeToCircles')}</h1>
          </SpacingStyle>

          <p>
            {context.t('Dashboard.trustDescription')}{' '}
            <a href="#">{context.t('Dashboard.learnMore')}</a>
          </p>

          <SpacingStyle>
            <QRCode data={safe.address} />
          </SpacingStyle>

          <SpacingStyle>
            <p>{context.t('Dashboard.showThisQR')}</p>
          </SpacingStyle>

          <SpacingStyle>
            <RoundButton to="/invite">
              <IconShare />
              <span>{context.t('Dashboard.share')}</span>
            </RoundButton>
          </SpacingStyle>
        </View>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <View isHeader>
        <TrustHealthDisplay isTrusted />
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
