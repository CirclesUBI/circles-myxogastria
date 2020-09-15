import PropTypes from 'prop-types';
import React from 'react';

import Button from '~/components/Button';
import ButtonClipboard from '~/components/ButtonClipboard';

const DEFAULT_SHARE_TITLE = 'Circles';

const ButtonShare = ({
  title = DEFAULT_SHARE_TITLE,
  text,
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
      <ButtonClipboard {...props} text={text}>
        {children}
      </ButtonClipboard>
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
  text: PropTypes.string.isRequired,
  title: PropTypes.string,
  url: PropTypes.string.isRequired,
};

export default ButtonShare;
