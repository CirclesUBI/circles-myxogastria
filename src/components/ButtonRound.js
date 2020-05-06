import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import styles from '~/styles/variables';
import { ButtonStyle } from '~/components/Button';
import { IconBase, IconSend } from '~/styles/Icons';

// eslint-disable-next-line react/display-name
const ButtonRound = React.forwardRef(({ to, children, ...props }, ref) => {
  if (to) {
    return (
      <Link to={to}>
        <ButtonRoundStyle {...props} ref={ref}>
          {children}
        </ButtonRoundStyle>
      </Link>
    );
  }

  return (
    <ButtonRoundStyle {...props} ref={ref}>
      {children}
    </ButtonRoundStyle>
  );
});

ButtonRound.propTypes = {
  children: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  isConfirmed: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export const ButtonRoundStyle = styled(ButtonStyle)`
  position: relative;

  display: flex;

  width: 7rem;
  height: 7rem;

  margin: 1rem auto;
  padding: 1rem;

  border-radius: 50%;

  background: ${(props) => {
    if (props.isConfirmed) {
      return `linear-gradient(
        90deg,
        ${styles.colors.secondaryDark},
        ${styles.colors.secondary} 100%
      );`;
    }

    if (props.disabled) {
      return `linear-gradient(
        90deg,
        ${styles.monochrome.gray},
        ${styles.monochrome.grayLight} 100%
      );`;
    }

    return `linear-gradient(
      90deg,
      ${styles.colors.primary},
      ${styles.colors.primaryDark} 100%
    );`;
  }};

  box-shadow: 1px 1px 7px ${styles.monochrome.grayDark};

  align-items: center;
  flex-direction: column;
  justify-content: center;

  &:hover {
    &::after {
      opacity: 0.2;
    }
  }

  &::after {
    position: absolute;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    display: block;

    border-radius: 50%;

    content: '';

    background-color: ${styles.monochrome.white};

    opacity: 0;

    transition: opacity 0.3s ease-in;

    pointer-events: none;
  }

  span {
    margin-top: 0.3rem;

    color: ${styles.monochrome.white};

    font-weight: ${styles.base.typography.weightLight};
  }

  ${IconBase} {
    &::before {
      color: ${styles.monochrome.white};

      font-size: 1.5em;
    }
  }

  ${IconSend} {
    position: relative;

    right: 3px;
  }
`;

export default ButtonRound;
