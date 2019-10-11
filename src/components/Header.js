import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Header = props => {
  return <HeaderStyle>{props.children}</HeaderStyle>;
};

Header.propTypes = {
  children: PropTypes.node.isRequired,
};

const HeaderStyle = styled.header`
  display: flex;

  height: 5rem;

  align-items: center;
  justify-content: space-between;
`;

export default Header;
