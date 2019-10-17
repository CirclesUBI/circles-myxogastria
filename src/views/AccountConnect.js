import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
import Header from '~/components/Header';
import QRCode from '~/components/QRCode';
import View from '~/components/View';
import { SpacingStyle } from '~/styles/Layout';

const AccountConnect = (props, context) => {
  const { address } = useSelector(state => state.wallet);

  return (
    <Fragment>
      <Header>
        <BackButton isDark to="/welcome" />
      </Header>

      <View isHeader>
        <SpacingStyle>
          <h1>{context.t('AccountConnect.connectToYourWallet')}</h1>
        </SpacingStyle>

        <SpacingStyle>
          <QRCode data={address} />
        </SpacingStyle>

        <p>
          {context.t('AccountConnect.noSeedPhrase')}{' '}
          <Link to="/welcome/new">
            {context.t('AccountConnect.createNewWallet')}
          </Link>
        </p>

        <p>
          {context.t('AccountConnect.questions')}{' '}
          <a href="#">{context.t('AccountConnect.contactUs')}</a>
        </p>

        <ButtonPrimary to="/welcome/seed">
          {context.t('AccountConnect.restoreWithSeedPhrase')}
        </ButtonPrimary>
      </View>
    </Fragment>
  );
};

AccountConnect.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default AccountConnect;
