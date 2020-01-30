import PropTypes from 'prop-types';
import React from 'react';

import ButtonPrimary from '~/components/ButtonPrimary';
import RoundButton from '~/components/RoundButton';
import { IconShare } from '~/styles/Icons';

const ShareButton = (props, context) => {
  const { title, text, url } = props;

  const onShare = () => {
    // Use Native Share API
    window.navigator.share({
      title,
      text,
      url,
    });
  };

  if (!props.isPrimary) {
    return (
      <RoundButton onClick={onShare}>
        <IconShare />
        <span>{context.t('ShareButton.share')}</span>
      </RoundButton>
    );
  }

  return (
    <ButtonPrimary onClick={onShare}>
      {context.t('ShareButton.share')}
    </ButtonPrimary>
  );
};

ShareButton.contextTypes = {
  t: PropTypes.func.isRequired,
};

ShareButton.propTypes = {
  isPrimary: PropTypes.bool,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default ShareButton;
