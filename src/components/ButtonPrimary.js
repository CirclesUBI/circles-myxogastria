import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import styles from '~/styles/variables';
import { ButtonStyle } from '~/components/Button';

// eslint-disable-next-line react/display-name
const ButtonPrimary = React.forwardRef(({ children, to, ...props }, ref) => {
  if (to) {
    return (
      <Link style={{ width: '100%' }} to={to}>
        <ButtonPrimaryStyle {...props} ref={ref}>
          {children}
        </ButtonPrimaryStyle>
      </Link>
    );
  }

  return (
    <ButtonPrimaryStyle {...props} ref={ref}>
      {children}
    </ButtonPrimaryStyle>
  );
});

ButtonPrimary.propTypes = {
  children: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  isOutline: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export const ButtonPrimaryStyle = styled(ButtonStyle)`
  display: block;

  width: 100%;

  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;

  border: ${props => {
    if (props.disabled) {
      return props.isOutline ? `1px solid ${styles.monochrome.gray}` : 0;
    }

    return props.isOutline ? `1px solid ${styles.colors.primary}` : 0;
  }};
  border-radius: 1.6rem;

  color: ${props => {
    return props.disabled ? styles.monochrome.gray : styles.monochrome.white;
  }};

  background: ${props => {
    if (props.isOutline) {
      return styles.monochrome.white;
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

  font-weight: ${styles.base.typography.weightSemiBold};
  font-size: 1.1em;

  transition: opacity 0.3s linear;

  &:hover {
    opacity: 0.75;
  }

  a {
    color: ${styles.components.button.color};
  }
`;

export default ButtonPrimary;
