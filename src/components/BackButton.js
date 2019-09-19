import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

import Button from '~/components/Button';

const BackButton = ({ history, ...props }) => {
  const onClick = () => {
    history.goBack();
  };

  return (
    <Button {...props} onClick={onClick}>
      &lt;
    </Button>
  );
};

BackButton.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(BackButton);
