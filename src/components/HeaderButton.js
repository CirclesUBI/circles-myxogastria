import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { ButtonStyle } from '~/components/Button';
import { IconBase, IconExit } from '~/styles/Icons';

const HeaderButton = ({ children, ...props }) => {
  return <HeaderButtonStyle {...props}>{children}</HeaderButtonStyle>;
};

HeaderButton.propTypes = {
  children: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

const HeaderButtonStyle = styled(ButtonStyle)`
  padding: 1.5rem;

  ${IconBase} {
    position: relative;

    transition: opacity 0.2s linear;

    &::before {
      font-size: 2.5em;
    }

    &:hover {
      &::before {
        opacity: 0.85;
      }
    }
  }

  ${IconExit} {
    &::before {
      font-size: 2em;
    }
  }
`;

export default HeaderButton;
