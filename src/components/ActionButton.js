import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

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
      <Link to="/trust">
        <Button>Trust</Button>
      </Link>

      <Link to="/receive">
        <Button>Receive</Button>
      </Link>

      <Link to="/send">
        <Button>Send</Button>
      </Link>
    </Fragment>
  );
};

ActionButtonExtended.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export default ActionButton;
