import Clipboard from 'clipboard';
import PropTypes from 'prop-types';
import React, { Fragment, createRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';
import notify from '~/store/notifications/actions';

const SettingsShare = (props, context) => {
  const dispatch = useDispatch();
  const safe = useSelector(state => state.safe);

  const shareLink = `${process.env.BASE_PATH}/profile/${safe.address}`;

  const shareText = `Hi! Check out my profile at: ${shareLink}`; // @TODO

  const refButton = createRef();

  const initializeClipboard = () => {
    const clipboard = new Clipboard(refButton.current, {
      text: () => {
        return shareText;
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

  return (
    <Fragment>
      <Header>
        <BackButton to="/settings" />
      </Header>

      <View>
        <textarea readOnly={true} value={shareText} />
      </View>

      <Footer>
        <Button ref={refButton}>{context.t('views.settings.clipboard')}</Button>
      </Footer>
    </Fragment>
  );
};

SettingsShare.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SettingsShare;
