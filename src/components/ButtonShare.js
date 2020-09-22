import PropTypes from 'prop-types';
import React from 'react';
import { IconButton } from '@material-ui/core';

import Button from '~/components/Button';
import ButtonClipboard from '~/components/ButtonClipboard';

const DEFAULT_SHARE_TITLE = 'Circles';

const ButtonShare = ({
  title = DEFAULT_SHARE_TITLE,
  text,
  isIcon,
  url,
  children,
  ...props
}) => {
  const onShare = () => {
    // Use Native Share API
    window.navigator.share({
      title,
      text,
      url,
    });
  };

  if (!window.navigator.share) {
    return (
      <ButtonClipboard {...props} isIcon={isIcon} text={title}>
        {children}
      </ButtonClipboard>
    );
  }

  if (isIcon) {
    return (
      <IconButton {...props} onClick={onShare}>
        {children}
      </IconButton>
    );
  }

  return (
    <Button {...props} onClick={onShare}>
      {children}
    </Button>
  );
};

ButtonShare.propTypes = {
  children: PropTypes.node.isRequired,
  isIcon: PropTypes.bool,
  text: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string.isRequired,
};

export default ButtonShare;
