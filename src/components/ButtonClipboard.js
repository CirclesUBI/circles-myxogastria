import Clipboard from 'clipboard';
import PropTypes from 'prop-types';
import React, { createRef, useEffect } from 'react';
import { IconButton } from '@material-ui/core';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import notify from '~/store/notifications/actions';
import translate from '~/services/locale';

const ButtonClipboard = ({ text, children, isIcon, ...props }) => {
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
          text: translate('ButtonClipboard.infoCopiedMessage'),
        }),
      );
    });

    return () => {
      clipboard.destroy();
    };
  }, [dispatch, ref, text]);

  if (isIcon) {
    return (
      <IconButton {...props} ref={ref}>
        {children ? children : translate('ButtonClipboard.buttonCopy')}
      </IconButton>
    );
  }

  return (
    <Button {...props} ref={ref}>
      {children ? children : translate('ButtonClipboard.buttonCopy')}
    </Button>
  );
};

ButtonClipboard.propTypes = {
  children: PropTypes.node,
  isIcon: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

export default ButtonClipboard;
