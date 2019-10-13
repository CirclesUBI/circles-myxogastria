import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';

const Header = props => {
  return <HeaderStyle>{props.children}</HeaderStyle>;
};

Header.propTypes = {
  children: PropTypes.node.isRequired,
};

export const HeaderStyle = styled.header`
  position: absolute;

  top: 0;
  right: 0;
  left: 0;

  z-index: ${styles.zIndex.header};

  display: flex;

  height: ${styles.components.header.height};

  padding: ${styles.layout.spacing};

  align-items: center;
  justify-content: space-between;
`;

export default Header;
