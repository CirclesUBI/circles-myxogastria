import Clipboard from 'clipboard';
import PropTypes from 'prop-types';
import React, { createRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import notify from '~/store/notifications/actions';

const ClipboardButton = props => {
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
          text: 'Copied!', // @TODO
        }),
      );
    });

    return () => {
      clipboard.destroy();
    };
  };

  useEffect(initializeClipboard, []);

  return <Button ref={ref}>{props.children}</Button>;
};

ClipboardButton.propTypes = {
  children: PropTypes.any.isRequired,
  text: PropTypes.string.isRequired,
};

export default ClipboardButton;
