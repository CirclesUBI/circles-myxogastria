import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';
import { ButtonStyle } from '~/components/Button';
import { IconBase } from '~/styles/Icons';

const HeaderButton = ({ children, ...props }) => {
  return <HeaderButtonStyle {...props}>{children}</HeaderButtonStyle>;
};

HeaderButton.propTypes = {
  children: PropTypes.any.isRequired,
  count: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  isDark: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

const HeaderButtonStyle = styled(ButtonStyle)`
  padding: 1.5rem;

  ${IconBase} {
    position: relative;

    &::before {
      color: ${props => {
        return props.isDark ? styles.monochrome.black : styles.monochrome.white;
      }};

      font-size: 2.5em;
    }
  }
`;

export default HeaderButton;
