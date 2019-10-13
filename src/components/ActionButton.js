import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';

import Button from '~/components/Button';

const ActionButton = () => {
  const [isActive, setIsActive] = useState(false);

  const onToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <Fragment>
      <ActionButtonExtended isActive={isActive} />
      <Button onClick={onToggle}>+</Button>
    </Fragment>
  );
};

const ActionButtonExtended = props => {
  if (!props.isActive) {
    return null;
  }

  return (
    <Fragment>
      <Button to="/trust">Trust</Button>
      <Button to="/receive">Receive</Button>
      <Button to="/send">Send</Button>
    </Fragment>
  );
};

ActionButtonExtended.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export default ActionButton;
