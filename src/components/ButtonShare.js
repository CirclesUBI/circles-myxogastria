import PropTypes from 'prop-types';
import React from 'react';

import ButtonPrimary from '~/components/ButtonPrimary';
import ButtonRound from '~/components/ButtonRound';
import { IconShare } from '~/styles/Icons';

const ButtonShare = (props, context) => {
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
      <ButtonRound onClick={onShare}>
        <IconShare />
        <span>{context.t('ButtonShare.share')}</span>
      </ButtonRound>
    );
  }

  return (
    <ButtonPrimary onClick={onShare}>
      {context.t('ButtonShare.share')}
    </ButtonPrimary>
  );
};

ButtonShare.contextTypes = {
  t: PropTypes.func.isRequired,
};

ButtonShare.propTypes = {
  isPrimary: PropTypes.bool,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default ButtonShare;
