import PropTypes from 'prop-types';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { removeNotification } from '~/store/notifications/actions';

const Notifications = () => {
  const { messages } = useSelector(state => state.notifications);

  return (
    <ul>
      <NotificationsList items={messages} />
    </ul>
  );
};

const NotificationsList = props => {
  return props.items.map(item => {
    return (
      <NotificationsItem
        id={item.id}
        key={item.id}
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

  return (
    <li>
      {props.text} <button onClick={onRemove}>Hide</button>
    </li>
  );
};

NotificationsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      type: PropTypes.symbol,
    }),
  ).isRequired,
};

NotificationsItem.propTypes = {
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.symbol.isRequired,
};

export default Notifications;
