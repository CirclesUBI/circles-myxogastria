import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';
import { HeaderStyle } from '~/components/Header';

const View = props => {
  return <ViewStyle>{props.children}</ViewStyle>;
};

View.propTypes = {
  children: PropTypes.node.isRequired,
};

const ViewStyle = styled.main`
  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: ${styles.zIndex.view};

  overflow-x: hidden;
  overflow-y: auto;

  padding: ${styles.base.layout.spacing};
  padding-bottom: ${styles.components.footer.height};

  text-align: center;

  ${HeaderStyle} + & {
    padding-top: ${styles.components.header.height};
  }
`;

export default View;
