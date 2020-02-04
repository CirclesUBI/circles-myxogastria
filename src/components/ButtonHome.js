import PropTypes from 'prop-types';
import React from 'react';

import { IconExit } from '~/styles/Icons';
import ButtonHeader from '~/components/ButtonHeader';

const ButtonHome = ({ isDark, ...props }) => {
  return (
    <ButtonHeader {...props} to={props.onClick ? null : '/'}>
      <IconExit isDark={isDark} />
    </ButtonHeader>
  );
};

ButtonHome.propTypes = {
  isDark: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default ButtonHome;
