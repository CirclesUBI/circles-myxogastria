import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';

const View = props => {
  return (
    <ViewStyle
      isFooter={props.isFooter}
      isHeader={props.isHeader}
      isPushingToBottom={props.isPushingToBottom}
    >
      {props.children}
    </ViewStyle>
  );
};

View.propTypes = {
  children: PropTypes.node.isRequired,
  isFooter: PropTypes.bool,
  isHeader: PropTypes.bool,
  isPushingToBottom: PropTypes.bool,
};

export const ViewStyle = styled.main`
  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: ${styles.zIndex.view};

  display: ${props => {
    return props.isPushingToBottom ? 'flex' : 'block';
  }};

  overflow-x: hidden;
  overflow-y: auto;

  padding-top: ${props => {
    return props.isHeader ? styles.components.header.height : 0;
  }};
  padding-right: ${styles.base.layout.spacing};
  padding-left: ${styles.base.layout.spacing};

  text-align: center;

  flex-direction: column;

  &::after {
    display: block;

    height: ${props => {
      return props.isFooter ? styles.components.footer.height : 0;
    }};

    content: '';
  }
`;

export default View;
