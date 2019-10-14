import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import styles from '~/styles/variables';
import ButtonStyle from '~/components/Button';

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
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export const ButtonPrimaryStyle = styled(ButtonStyle)`
  display: block;

  width: 100%;

  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;

  border-radius: 1rem;

  color: ${styles.components.button.color};

  background-color: ${props => {
    return props.disabled
      ? styles.components.button.colorDisabled
      : styles.components.button.colorPrimary;
  }};

  a {
    color: ${styles.components.button.color};
  }
`;

export default ButtonPrimary;
