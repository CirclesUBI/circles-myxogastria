import PropTypes from 'prop-types';
import React from 'react';

import { IconExit } from '~/styles/Icons';
import HeaderButton from '~/components/HeaderButton';

const HomeButton = ({ isDark, ...props }) => {
  return (
    <HeaderButton {...props} to="/">
      <IconExit isDark={isDark} />
    </HeaderButton>
  );
};

HomeButton.propTypes = {
  isDark: PropTypes.bool,
};

export default HomeButton;
