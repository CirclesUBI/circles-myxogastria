import PropTypes from 'prop-types';
import React from 'react';

import ButtonPrimary from '~/components/ButtonPrimary';
import ButtonRound from '~/components/ButtonRound';
import translate from '~/services/locale';

const ButtonShare = (props) => {
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
        <span>{translate('ButtonShare.share')}</span>
      </ButtonRound>
    );
  }

  return (
    <ButtonPrimary onClick={onShare}>
      {translate('ButtonShare.share')}
    </ButtonPrimary>
  );
};

ButtonShare.propTypes = {
  isPrimary: PropTypes.bool,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default ButtonShare;
