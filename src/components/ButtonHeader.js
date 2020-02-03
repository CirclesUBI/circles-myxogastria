import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { ButtonStyle } from '~/components/Button';
import { IconBase, IconExit } from '~/styles/Icons';

const ButtonHeader = ({ children, ...props }) => {
  return <ButtonHeaderStyle {...props}>{children}</ButtonHeaderStyle>;
};

ButtonHeader.propTypes = {
  children: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

const ButtonHeaderStyle = styled(ButtonStyle)`
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

export default ButtonHeader;
