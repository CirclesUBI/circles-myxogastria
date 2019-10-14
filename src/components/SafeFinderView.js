import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';

import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import QRCodeScanner from '~/components/QRCodeScanner';
import UsernameFinder from '~/components/UsernameFinder';
import View from '~/components/View';

const MODE_QR = Symbol('qr');
const MODE_USERNAME = Symbol('username');

const SafeFinderView = props => {
  const [mode, setMode] = useState(MODE_QR);
  const [usernameInput, setUsernameInput] = useState('');

  const onFooterClick = () => {
    setMode(MODE_QR);
    setUsernameInput('');
  };

  const onUserInputChange = value => {
    if (mode !== MODE_USERNAME) {
      setMode(MODE_USERNAME);
    }

    setUsernameInput(value);
  };

  const onSelect = safeAddress => {
    setUsernameInput('');

    props.onSelect(safeAddress);
  };

  const onUserSelect = user => {
    props.onSelect(user.safeAddress);
  };

  return (
    <Fragment>
      <View>
        <UsernameFinder
          input={usernameInput}
          onInputChange={onUserInputChange}
          onSelect={onUserSelect}
        />

        <SafeFinderQRScanner isHidden={mode !== MODE_QR} onSuccess={onSelect} />
      </View>

      <SafeFinderViewFooter
        isHidden={mode === MODE_QR}
        onClick={onFooterClick}
      />
    </Fragment>
  );
};

const SafeFinderQRScanner = props => {
  if (props.isHidden) {
    return null;
  }

  const onSuccess = result => {
    props.onSuccess(result);
  };

  return <QRCodeScanner onSuccess={onSuccess} />;
};

const SafeFinderViewFooter = (props, context) => {
  if (props.isHidden) {
    return null;
  }

  const onClick = () => {
    props.onClick();
  };

  return (
    <Footer>
      <ButtonPrimary onClick={onClick}>
        {context.t('SafeFinderView.tapToScanQR')}
      </ButtonPrimary>
    </Footer>
  );
};

SafeFinderView.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

SafeFinderQRScanner.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

SafeFinderViewFooter.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

SafeFinderView.contextTypes = {
  t: PropTypes.func.isRequired,
};

SafeFinderViewFooter.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SafeFinderView;
