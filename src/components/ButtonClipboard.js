import { IconButton } from '@material-ui/core';
import Clipboard from 'clipboard';
import PropTypes from 'prop-types';
import React, { createRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import translate from '~/services/locale';
import notify, { NotificationsTypes } from '~/store/notifications/actions';

const ButtonClipboard = ({ text, children, isIcon, ...props }) => {
  const dispatch = useDispatch();
  const ref = createRef();

  useEffect(() => {
    const clipboard = new Clipboard(ref.current, {
      container: ref.current,
      text: () => {
        return text;
      },
    });

    clipboard.on('success', () => {
      dispatch(
        notify({
          type: NotificationsTypes.SUCCESS,
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
