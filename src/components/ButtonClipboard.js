import Clipboard from 'clipboard';
import PropTypes from 'prop-types';
import React, { createRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import ButtonPrimary from '~/components/ButtonPrimary';
import ButtonRound from '~/components/ButtonRound';
import notify from '~/store/notifications/actions';
import translate from '~/services/locale';

const ButtonClipboard = (props) => {
  const dispatch = useDispatch();
  const ref = createRef();

  const initializeClipboard = () => {
    const clipboard = new Clipboard(ref.current, {
      text: () => {
        return props.text;
      },
    });

    clipboard.on('success', () => {
      dispatch(
        notify({
          text: translate('ButtonClipboard.copiedMessage'),
        }),
      );
    });

    return () => {
      clipboard.destroy();
    };
  };

  useEffect(initializeClipboard, [props.text]);

  if (!props.isPrimary) {
    return (
      <ButtonRound ref={ref}>
        <span>{translate('ButtonClipboard.share')}</span>
      </ButtonRound>
    );
  }

  return (
    <ButtonPrimary ref={ref}>
      {translate('ButtonClipboard.copyToClipboard')}
    </ButtonPrimary>
  );
};

ButtonClipboard.propTypes = {
  isPrimary: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

export default ButtonClipboard;
