import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Pill from '~/components/Pill';
import Spinner from '~/components/Spinner';
import UsernameDisplay from '~/components/UsernameDisplay';
import core from '~/services/core';
import styles from '~/styles/variables';
import { ONBOARDING_FINALIZATION } from '~/store/activity/actions';
import { ZERO_ADDRESS } from '~/utils/constants';
import { formatCirclesValue } from '~/utils/format';

import {
  IconBase,
  IconKeys,
  IconNotification,
  IconReceive,
  IconSpinner,
  IconTrust,
} from '~/styles/Icons';

const { ActivityTypes } = core.activity;

// Parse the activity item and extract the most
// interesting bits from it ..
function formatMessage(props) {
  let actorAddress;
  let isOwnerAddress = false;
  let messageId;

  if (props.type === ActivityTypes.ADD_CONNECTION) {
    if (props.data.canSendTo === props.safeAddress) {
      // I've created a trust connection
      messageId = 'meTrustedSomeone';
      actorAddress = props.data.user;
    } else {
      // Someone created a trust connection with you
      messageId = 'trustedBySomeone';
      actorAddress = props.data.canSendTo;
    }
  } else if (props.type === ActivityTypes.REMOVE_CONNECTION) {
    if (props.data.canSendTo === props.safeAddress) {
      // I've removed a trust connection
      messageId = 'meUntrustedSomeone';
      actorAddress = props.data.user;
    } else {
      // Someone removed a trust connection with you
      messageId = 'untrustedBySomeone';
      actorAddress = props.data.canSendTo;
    }
  } else if (props.type === ActivityTypes.TRANSFER) {
    if (props.data.from === ZERO_ADDRESS) {
      // I've received Circles from the Hub (UBI)
      messageId = 'receivedUBI';
    } else if (props.data.to === process.env.SAFE_FUNDER_ADDRESS) {
      // I've paid Gas fees for a transaction
      // @TODO: Right now not covered by the core
      messageId = 'paidGasCosts';
    }
  } else if (props.type === ActivityTypes.HUB_TRANSFER) {
    if (props.data.to === props.safeAddress) {
      // I've received Circles from someone
      messageId = 'receivedCircles';
      actorAddress = props.data.from;
    } else {
      // I've sent Circles to someone
      messageId = 'sentCircles';
      actorAddress = props.data.to;
    }
  } else if (props.type === ActivityTypes.ADD_OWNER) {
    if (props.data.ownerAddress === props.walletAddress) {
      // I've got added to a Safe (usually during Safe creation)
      messageId = 'myselfAddedToSafe';
    } else {
      // I've added someone to my Safe
      messageId = 'addedToSafe';
      isOwnerAddress = true;
      actorAddress = props.data.ownerAddress;
    }
  } else if (props.type === ActivityTypes.REMOVE_OWNER) {
    // I've removed someone from my Safe
    messageId = 'removedFromSafe';
    isOwnerAddress = true;
    actorAddress = props.data.ownerAddress;
  } else if (props.type === ONBOARDING_FINALIZATION) {
    // I've just finished onboarding
    messageId = 'safeAndTokenDeployed';
  }

  // Format the given timestamp to a readable string
  const date = DateTime.fromMillis(props.timestamp).toFormat('dd/LL/yy HH:mm');

  // Check if find a value in the data (during transfers)
  const data = Object.assign({}, props.data);

  if ('value' in data) {
    // Convert the value according to its denominator
    const valueInCircles = formatCirclesValue(data.value, 4);

    data.denominator = 'Circles';
    data.value = valueInCircles;
  }

  if (!messageId) {
    throw new Error('Unknown activity type');
  }

  return {
    actorAddress,
    data,
    date,
    isOwnerAddress,
    messageId,
  };
}

const ActivityStream = () => {
  return (
    <ActivityStreamStyle>
      <ActivityStreamList />
    </ActivityStreamStyle>
  );
};

const ActivityStreamList = (props, context) => {
  const { activities, lastSeen, safeAddress, walletAddress } = useSelector(
    state => {
      return {
        activities: state.activity.activities,
        lastSeen: state.activity.lastSeen,
        safeAddress: state.safe.address,
        walletAddress: state.wallet.address,
      };
    },
  );

  if (activities.length === 0) {
    return <Pill>{context.t('ActivityStream.nothingHereYet')}</Pill>;
  }

  return activities
    .sort((itemA, itemB) => {
      return itemB.timestamp - itemA.timestamp;
    })
    .reduce((acc, { data, id, timestamp, type, txHash, isPending = false }) => {
      // Filter Gas transfers
      if (
        type === ActivityTypes.TRANSFER &&
        data.to === process.env.SAFE_FUNDER_ADDRESS
      ) {
        return acc;
      }

      const item = (
        <ActivityStreamItem
          data={data}
          isPending={isPending}
          isSeen={timestamp < lastSeen}
          key={`${txHash}${id}${timestamp}`}
          safeAddress={safeAddress}
          timestamp={timestamp}
          type={type}
          walletAddress={walletAddress}
        />
      );

      acc.push(item);

      return acc;
    }, []);
};

const ActivityStreamItem = (props, context) => {
  // Reformat the message for the user
  const { date, data, messageId, actorAddress, isOwnerAddress } = formatMessage(
    props,
  );

  // Check if we should display the address on the left or right hand side
  const isAddressRightSide = [
    'meTrustedSomeone',
    'meUntrustedSomeone',
    'sentCircles',
  ].includes(messageId);

  return (
    <ItemStyle isSeen={props.isSeen}>
      <ActivityStreamIcon isPending={props.isPending} type={props.type} />

      <ItemContentStyle>
        <ItemMessageStyle>
          <ActivityStreamActor
            address={actorAddress}
            isHidden={isAddressRightSide}
            isOwnerAddress={isOwnerAddress}
          />

          {context.t(`ActivityStream.${messageId}`, { ...data })}

          <ActivityStreamActor
            address={actorAddress}
            isHidden={!isAddressRightSide}
            isOwnerAddress={isOwnerAddress}
          />
        </ItemMessageStyle>

        <ItemDateStyle>{date}</ItemDateStyle>
      </ItemContentStyle>
    </ItemStyle>
  );
};

const ActivityStreamActor = props => {
  if (props.isHidden) {
    return null;
  }

  if (!props.address) {
    return null;
  }

  if (props.isOwnerAddress) {
    return <ItemActorStyle>{props.address.slice(0, 10)}</ItemActorStyle>;
  }

  return (
    <ItemActorStyle>
      <Link to={`/profile/${props.address}`}>
        <UsernameDisplay address={props.address} />
      </Link>
    </ItemActorStyle>
  );
};

const ActivityStreamIcon = props => {
  if (props.isPending) {
    return <Spinner />;
  }

  if (props.type === ActivityTypes.TRANSFER) {
    return <IconReceive />;
  } else if (
    props.type === ActivityTypes.ADD_CONNECTION ||
    props.type === ActivityTypes.REMOVE_CONNECTION
  ) {
    return <IconTrust />;
  } else if (
    props.type === ActivityTypes.ADD_OWNER ||
    props.type === ActivityTypes.REMOVE_OWNER
  ) {
    return <IconKeys />;
  }

  return <IconNotification />;
};

ActivityStream.contextTypes = {
  t: PropTypes.func.isRequired,
};

ActivityStreamList.contextTypes = {
  t: PropTypes.func.isRequired,
};

ActivityStreamItem.contextTypes = {
  t: PropTypes.func.isRequired,
};

ActivityStreamItem.propTypes = {
  data: PropTypes.object.isRequired,
  isPending: PropTypes.bool.isRequired,
  isSeen: PropTypes.bool.isRequired,
  safeAddress: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  type: PropTypes.symbol.isRequired,
  walletAddress: PropTypes.string.isRequired,
};

ActivityStreamActor.propTypes = {
  address: PropTypes.string,
  isHidden: PropTypes.bool,
  isOwnerAddress: PropTypes.bool.isRequired,
};

ActivityStreamIcon.propTypes = {
  isPending: PropTypes.bool.isRequired,
  type: PropTypes.symbol.isRequired,
};

const ActivityStreamStyle = styled.ul`
  list-style: none;
`;

const ItemStyle = styled.li`
  display: flex;

  height: 8rem;

  margin-bottom: 1rem;
  padding-right: 3rem;
  padding-left: 3rem;

  border-radius: 5rem;

  background: ${props => {
    if (!props.isSeen) {
      return `linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(255, 255, 255, 0.85) 100%
      );`;
    }

    return `linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(255, 255, 255, 0.72) 100%
    );`;
  }};

  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

  align-items: center;
  justify-content: flex-start;

  ${IconBase} {
    position: relative;

    top: -3px;

    color: ${styles.colors.primary};

    font-size: 2.5em;
  }

  ${IconSpinner} {
    top: 0;

    &::before {
      font-size: 1.2em;
    }
  }
`;

const ItemContentStyle = styled.div`
  display: flex;

  overflow: hidden;

  margin-left: 2rem;

  font-weight: ${styles.base.typography.weightLight};

  line-height: 1.25;

  text-align: left;

  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
`;

const ItemMessageStyle = styled.p`
  overflow: hidden;

  max-width: initial;

  margin: 0;

  text-overflow: ellipsis;
`;

const ItemDateStyle = styled.p`
  max-width: initial;

  margin: 0;
`;

const ItemActorStyle = styled.span`
  margin-right: 0.5rem;

  color: ${styles.colors.primary};

  font-weight: ${styles.base.typography.weightLight};

  a {
    color: ${styles.colors.primary};

    font-weight: ${styles.base.typography.weightLight};
  }
`;

export default ActivityStream;
