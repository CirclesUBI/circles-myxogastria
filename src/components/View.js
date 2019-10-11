import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';

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

  margin-top: ${styles.components.header.height};
  margin-bottom: ${styles.components.footer.height};
  padding: 1rem;
`;

export default View;
