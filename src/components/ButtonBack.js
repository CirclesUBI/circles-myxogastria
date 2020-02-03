import PropTypes from 'prop-types';
import React from 'react';

import { IconBack } from '~/styles/Icons';
import ButtonHeader from '~/components/ButtonHeader';

const ButtonBack = ({ isDark, ...props }) => {
  return (
    <ButtonHeader {...props}>
      <IconBack isDark={isDark} />
    </ButtonHeader>
  );
};

ButtonBack.propTypes = {
  isDark: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default ButtonBack;
