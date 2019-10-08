import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import Button from '~/components/Button';
import ExternalLinkList from '~/components/ExternalLinkList';
import LocaleSelector from '~/components/LocaleSelector';
import View from '~/components/View';

const Welcome = (props, context) => {
  return (
    <Fragment>
      <View>
        <h1>{context.t('Welcome.welcomeToCircles')}</h1>
        <p>{context.t('Welcome.haveWalletAlready')}</p>

        <Link to="/welcome/connect">
          <Button>{context.t('Welcome.connectYourWallet')}</Button>
        </Link>

        <p>{context.t('Welcome.noCirclesWallet')}</p>

        <Link to="/welcome/new">
          <Button>{context.t('Welcome.createNewWallet')}</Button>
        </Link>

        <LocaleSelector />
        <ExternalLinkList />
      </View>
    </Fragment>
  );
};

Welcome.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Welcome;
