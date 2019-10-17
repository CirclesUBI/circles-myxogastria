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

  margin-right: 1rem;
  margin-left: 1rem;

  align-items: center;
  justify-content: space-between;
`;

export const HeaderCenterStyle = styled.div`
  position: absolute;

  top: 0;
  right: 0;
  left: 0;

  display: flex;

  height: ${styles.components.header.height};

  align-items: center;
  justify-content: center;

  pointer-events: none;
`;

export const HeaderTitleStyle = styled.h1`
  @media ${styles.media.desktop} {
    font-size: 1.5em;
  }

  color: ${props => {
    return props.isDark ? styles.monochrome.black : styles.monochrome.white;
  }};

  font-weight: ${styles.base.typography.weightSemiBold};
  font-size: 1.1em;

  pointer-events: initial;
`;

export default Header;
