import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button as MuiButton } from '@material-ui/core';

// eslint-disable-next-line react/display-name
const Button = React.forwardRef((props, ref) => {
  if (props.to) {
    return (
      <MuiButton
        className={props.className}
        component={Link}
        disabled={props.disabled}
        ref={ref}
        to={props.to}
        type={props.type}
      >
        {props.children}
      </MuiButton>
    );
  }

  return (
    <MuiButton
      className={props.className}
      disabled={props.disabled}
      ref={ref}
      type={props.type}
      onClick={props.onClick}
    >
      {props.children}
    </MuiButton>
  );
});

Button.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
  type: PropTypes.string,
};

export const ButtonStyle = styled(Button)`
  position: relative;

  display: inline-block;

  padding: 0;

  border: 0;
  border-radius: 0;

  background: transparent;

  outline: 0;

  text-align: center;
  text-decoration: none;

  cursor: pointer;

  &:focus {
    outline: 0;
  }

  &[disabled] {
    cursor: not-allowed;
  }
`;

export default Button;
