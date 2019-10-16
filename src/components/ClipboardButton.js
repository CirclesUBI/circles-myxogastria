import Clipboard from 'clipboard';
import PropTypes from 'prop-types';
import React, { createRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import RoundButton from '~/components/RoundButton';
import notify from '~/store/notifications/actions';
import { IconShare } from '~/styles/Icons';

const ClipboardButton = (props, context) => {
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
          text: context.t('ClipboardButton.copiedMessage'),
        }),
      );
    });

    return () => {
      clipboard.destroy();
    };
  };

  useEffect(initializeClipboard, [props.text]);

  return (
    <RoundButton ref={ref}>
      <IconShare />
      <span>{context.t('ClipboardButton.share')}</span>
    </RoundButton>
  );
};

ClipboardButton.contextTypes = {
  t: PropTypes.func.isRequired,
};

ClipboardButton.propTypes = {
  text: PropTypes.string.isRequired,
};

export default ClipboardButton;
