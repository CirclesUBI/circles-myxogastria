import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';
import { ButtonStyle } from '~/components/Button';

// eslint-disable-next-line react/display-name
const ButtonPrimary = React.forwardRef(({ children, ...props }, ref) => {
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
};

export const ButtonPrimaryStyle = styled(ButtonStyle)`
  display: block;

  width: 100%;

  padding: 1rem;

  border-radius: 1rem;

  color: ${styles.components.button.color};

  background-color: ${styles.colors.primary};

  & + & {
    margin-top: 1rem;
  }

  a {
    color: ${styles.components.button.color};
  }
`;

export default ButtonPrimary;
