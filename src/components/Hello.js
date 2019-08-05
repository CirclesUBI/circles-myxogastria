import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  color: palevioletred;

  font-weight: bold;
  font-size: 1.5em;

  text-align: center;
`;

export default class Hello extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  render() {
    return <Title>Hello {this.props.name}!</Title>;
  }
}
