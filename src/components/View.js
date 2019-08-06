import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class View extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  render() {
    return <main>{this.props.children}</main>;
  }
}
