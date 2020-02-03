import PropTypes from 'prop-types';
import React from 'react';

import { IconExit } from '~/styles/Icons';
import ButtonHeader from '~/components/ButtonHeader';

const ButtonHome = ({ isDark, ...props }) => {
  return (
    <ButtonHeader {...props} to="/">
      <IconExit isDark={isDark} />
    </ButtonHeader>
  );
};

ButtonHome.propTypes = {
  isDark: PropTypes.bool,
};

export default ButtonHome;
