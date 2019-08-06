import PropTypes from 'prop-types';
import React from 'react';

const View = props => {
  return <main>{props.children}</main>;
};

View.propTypes = {
  children: PropTypes.element.isRequired,
};

export default View;
