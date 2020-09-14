import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import Button from '~/components/Button';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import QRCode from '~/components/QRCode';
import View from '~/components/View';
import translate from '~/services/locale';
import { SpacingStyle } from '~/styles/Layout';
import { switchAccount } from '~/store/onboarding/actions';

const AccountConnect = () => {
  const dispatch = useDispatch();
  const { wallet, safe } = useSelector((state) => state);

  const onConnect = () => {
    dispatch(switchAccount(safe.accounts[0]));
  };

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/welcome" />
        {translate('AccountConnect.connectToYourWallet')}
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

            <Button onClick={onConnect}>Connect</Button>
          </Fragment>
        )}

        <SpacingStyle>
          <p>
            {translate('AccountConnect.noSeedPhrase')}{' '}
            <Link to="/welcome/onboarding">
              {translate('AccountConnect.createNewWallet')}
            </Link>
          </p>

          <p>
            {translate('AccountConnect.questions')}{' '}
            <a href="mailto:hello@joincircles.net">
              {translate('AccountConnect.contactUs')}
            </a>
          </p>
        </SpacingStyle>
      </View>

      <Footer>
        <Button to="/welcome/seed">
          {translate('AccountConnect.restoreWithSeedPhrase')}
        </Button>
      </Footer>
    </Fragment>
  );
};

export default AccountConnect;
