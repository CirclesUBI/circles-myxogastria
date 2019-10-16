import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import styles from '~/styles/variables';
import { IconNotification } from '~/styles/Icons';
import { removeNotification } from '~/store/notifications/actions';

const Notifications = () => {
  const { messages } = useSelector(state => state.notifications);

  if (messages.length === 0) {
    return null;
  }

  return (
    <NotificationsListStyle>
      <NotificationsList items={messages} />
    </NotificationsListStyle>
  );
};

const NotificationsList = props => {
  return props.items.map(item => {
    return (
      <NotificationsItem
        id={item.id}
        key={item.id}
        lifetime={item.lifetime}
        text={item.text}
        type={item.type}
      />
    );
  });
};

const NotificationsItem = props => {
  const dispatch = useDispatch();

  const onRemove = () => {
    dispatch(removeNotification(props.id));
  };

  useEffect(() => {
    let timeout;

    if (props.lifetime > 0) {
      timeout = window.setTimeout(() => {
        onRemove();
      }, props.lifetime);
    }

    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, []);

  return (
    <NotificationsItemStyle onClick={onRemove}>
      <IconNotification />
      {props.text}
    </NotificationsItemStyle>
  );
};

NotificationsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      lifetime: PropTypes.number,
      text: PropTypes.string,
      type: PropTypes.symbol,
    }),
  ).isRequired,
};

NotificationsItem.propTypes = {
  id: PropTypes.number.isRequired,
  lifetime: PropTypes.number,
  text: PropTypes.string.isRequired,
  type: PropTypes.symbol.isRequired,
};

const NotificationsListStyle = styled.ul`
  position: absolute;

  top: 0;
  right: 0;
  left: 0;

  z-index: ${styles.zIndex.notifications};
`;

const NotificationsItemStyle = styled.li`
  display: flex;

  margin: ${styles.base.layout.spacing};
  padding: 2rem;
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;

  border-radius: 5px;

  background-color: ${styles.monochrome.white};

  font-weight: ${styles.base.typography.weightLight};

  box-shadow: 1px 5px 5px ${styles.monochrome.gray};

  align-items: center;

  cursor: pointer;

  ${IconNotification} {
    margin-right: 1rem;

    &::before {
      color: ${styles.colors.primary};

      font-size: 2em;
    }
  }
`;

export default Notifications;
