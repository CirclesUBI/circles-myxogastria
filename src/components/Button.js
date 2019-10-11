import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

// eslint-disable-next-line react/display-name
const Button = React.forwardRef((props, ref) => {
  return (
    <ButtonStyle disabled={props.disabled} ref={ref} onClick={props.onClick}>
      {props.children}
    </ButtonStyle>
  );
});

Button.propTypes = {
  children: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export const ButtonStyle = styled.button`
  display: inline-block;

  padding: 0;

  border: 0;
  border-radius: 0;

  background: transparent;

  outline: 0;

  text-align: center;
  text-decoration: none;

  cursor: pointer;

  &[disabled] {
    cursor: not-allowed;
  }
`;

export default Button;
