import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import QRCode from '~/components/QRCode';
import View from '~/components/View';
import { SpacingStyle } from '~/styles/Layout';
import { switchAccount } from '~/store/onboarding/actions';

const AccountConnect = (props, context) => {
  const dispatch = useDispatch();
  const { wallet, safe } = useSelector((state) => state);

  const onConnect = () => {
    dispatch(switchAccount(safe.accounts[0]));
  };

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/welcome" />
        {context.t('AccountConnect.connectToYourWallet')}
      </Header>

      <View>
        <QRCode data={wallet.address} />

        {!safe.currentAccount && safe.accounts.length > 0 && (
          <Fragment>
            <p>Do you want to connect to these accounts?</p>

            <ul>
              {safe.accounts.map((account) => {
                return <li key={account}>{account}</li>;
              })}
            </ul>

            <ButtonPrimary onClick={onConnect}>Connect</ButtonPrimary>
          </Fragment>
        )}

        <SpacingStyle>
          <p>
            {context.t('AccountConnect.noSeedPhrase')}{' '}
            <Link to="/welcome/onboarding">
              {context.t('AccountConnect.createNewWallet')}
            </Link>
          </p>

          <p>
            {context.t('AccountConnect.questions')}{' '}
            <a href="mailto:hello@joincircles.net">
              {context.t('AccountConnect.contactUs')}
            </a>
          </p>
        </SpacingStyle>
      </View>

      <Footer>
        <ButtonPrimary to="/welcome/seed">
          {context.t('AccountConnect.restoreWithSeedPhrase')}
        </ButtonPrimary>
      </Footer>
    </Fragment>
  );
};

AccountConnect.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default AccountConnect;
