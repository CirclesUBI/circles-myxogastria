import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';

const Footer = props => {
  return <FooterStyle>{props.children}</FooterStyle>;
};

Footer.propTypes = {
  children: PropTypes.node.isRequired,
};

export const FooterStyle = styled.footer`
  position: absolute;

  right: 0;
  bottom: 0;
  left: 0;

  z-index: ${styles.zIndex.footer};

  display: flex;

  height: ${styles.components.footer.height};

  margin-bottom: 0.5rem;
  padding: ${styles.layout.spacing};

  align-items: center;
  justify-content: space-between;
`;

export default Footer;
