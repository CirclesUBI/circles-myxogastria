import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/display-name
const Button = React.forwardRef((props, ref) => {
  if (props.to) {
    return (
      <Link to={props.to}>
        <button className={props.className} disabled={props.disabled} ref={ref}>
          {props.children}
        </button>
      </Link>
    );
  }

  return (
    <button
      className={props.className}
      disabled={props.disabled}
      ref={ref}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
});

Button.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
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

  &[disabled] {
    cursor: not-allowed;
  }
`;

export default Button;
