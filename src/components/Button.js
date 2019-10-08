import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line react/display-name
const Button = React.forwardRef((props, ref) => {
  return (
    <button disabled={props.disabled} ref={ref} onClick={props.onClick}>
      {props.children}
    </button>
  );
});

Button.propTypes = {
  children: PropTypes.any.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
