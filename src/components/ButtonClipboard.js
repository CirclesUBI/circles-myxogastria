import Clipboard from 'clipboard';
import PropTypes from 'prop-types';
import React, { createRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import notify from '~/store/notifications/actions';
import translate from '~/services/locale';

const ButtonClipboard = ({ text, ...props }) => {
  const dispatch = useDispatch();
  const ref = createRef();

  useEffect(() => {
    const clipboard = new Clipboard(ref.current, {
      text: () => {
        return text;
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
  }, [text]);

  return (
    <Button {...props} ref={ref}>
      {translate('ButtonClipboard.buttonCopy')}
    </Button>
  );
};

ButtonClipboard.propTypes = {
  text: PropTypes.string.isRequired,
};

export default ButtonClipboard;
