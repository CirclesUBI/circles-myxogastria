import PropTypes from 'prop-types';
import React from 'react';
import { IconButton } from '@material-ui/core';

import Button from '~/components/Button';
import ButtonClipboard from '~/components/ButtonClipboard';

const DEFAULT_SHARE_TITLE = 'Circles UBI | Wallet';

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
      <ButtonClipboard {...props} isIcon={isIcon} text={`${text} ${url}`}>
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
  text: PropTypes.string.isRequired,
  title: PropTypes.string,
  url: PropTypes.string.isRequired,
};

export default ButtonShare;
