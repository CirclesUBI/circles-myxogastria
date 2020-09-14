import PropTypes from 'prop-types';
import React from 'react';

import Button from '~/components/Button';
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

  return <Button onClick={onShare}>{translate('ButtonShare.share')}</Button>;
};

ButtonShare.propTypes = {
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default ButtonShare;
