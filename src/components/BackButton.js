import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import Button from '~/components/Button';

const BackButton = props => {
  return (
    <Link to={props.to}>
      <Button {...props}>&lt;</Button>
    </Link>
  );
};

BackButton.propTypes = {
  to: PropTypes.string.isRequired,
};

export default withRouter(BackButton);
