import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import ActionButton from '~/components/ActionButton';
import BalanceDisplay from '~/components/BalanceDisplay';
import Header from '~/components/Header';
import HeaderButton from '~/components/HeaderButton';
import QRCode from '~/components/QRCode';
import RoundButton from '~/components/RoundButton';
import Spinner from '~/components/Spinner';
import TrustHealthDisplay from '~/components/TrustHealthDisplay';
import TrustNetwork from '~/components/TrustNetwork';
import View from '~/components/View';
import core from '~/services/core';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import styles from '~/styles/variables';
import web3 from '~/services/web3';
import { BackgroundWhirlyOrange } from '~/styles/Background';
import { IconQR, IconShare, IconActivities } from '~/styles/Icons';
import { SpacingStyle } from '~/styles/Layout';
import { formatCirclesValue } from '~/utils/format';
import { requestUBIPayout } from '~/store/token/actions';

const Dashboard = (props, context) => {
  const dispatch = useDispatch();

  const safe = useSelector(state => state.safe);
  const token = useSelector(state => state.token);

  useEffect(() => {
    if (token.isPayoutChecked || !token.address) {
      return;
    }

    const checkUBIPayout = async () => {
      // Check if we can collect some UBI
      const payout = await core.token.checkUBIPayout(safe.address);

      if (payout.lt(web3.utils.toBN(web3.utils.toWei('0.01', 'ether')))) {
        return;
      }

      // Display pending UBI to the user
      dispatch(
        notify({
          text: context.t('Dashboard.ubiPayoutReceived', {
            payout: formatCirclesValue(payout, 4),
          }),
          type: NotificationsTypes.INFO,
          timeout: 10000,
        }),
      );

      // .. and get it!
      await dispatch(requestUBIPayout());
    };

    checkUBIPayout();
  }, [token.address]);

  // We consider someone "trusted" when Safe got deployed
  const isTrusted = !safe.nonce;

  return (
    <BackgroundWhirlyOrange>
      <Header>
        <HeaderButton to="/settings">
          <IconQR />
        </HeaderButton>

        <BalanceDisplay />

        <HeaderButton to="/activities">
          <DashboardActivityIcon />
        </HeaderButton>
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

Dashboard.contextTypes = {
  t: PropTypes.func.isRequired,
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
