import PropTypes from 'prop-types';
import React from 'react';

import { IconBack } from '~/styles/Icons';
import HeaderButton from '~/components/HeaderButton';

const BackButton = ({ isDark, ...props }) => {
  return (
    <HeaderButton {...props}>
      <IconBack isDark={isDark} />
    </HeaderButton>
  );
};

BackButton.propTypes = {
  isDark: PropTypes.bool,
  to: PropTypes.string.isRequired,
};

export default BackButton;
