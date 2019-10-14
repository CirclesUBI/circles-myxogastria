import PropTypes from 'prop-types';
import React from 'react';

import Button from '~/components/Button';

const BackButton = props => {
  return <Button {...props}>&lt;</Button>;
};

BackButton.propTypes = {
  to: PropTypes.string.isRequired,
};

export default BackButton;
