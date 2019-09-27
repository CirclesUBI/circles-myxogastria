import PropTypes from 'prop-types';
import React from 'react';

const View = props => {
  return <main>{props.children}</main>;
};

View.propTypes = {
  children: PropTypes.node.isRequired,
};

export default View;
