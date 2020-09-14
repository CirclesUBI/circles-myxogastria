import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import Button from '~/components/Button';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { CONTACT_URL } from '~/components/ExternalLinkList';
import { SpacingStyle } from '~/styles/Layout';
import { TextareaStyle } from '~/styles/Inputs';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { restoreAccount } from '~/store/onboarding/actions';

const AccountImport = () => {
  const [seedPhrase, setSeedPhrase] = useState('');

  const dispatch = useDispatch();

  const onChange = (event) => {
    setSeedPhrase(event.target.value);
  };

  const onClick = async () => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(restoreAccount(seedPhrase));

      dispatch(
        notify({
          text: translate('AccountImport.welcomeMessage'),
        }),
      );

      dispatch(hideSpinnerOverlay());
    } catch (error) {
      dispatch(
        notify({
          text: translate('AccountImport.errorMessage'),
          type: NotificationsTypes.ERROR,
          lifetime: 10000,
        }),
      );

      dispatch(hideSpinnerOverlay());
    }
  };

  const isValid = seedPhrase.split(' ').length === 24;

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/welcome/connect" />
        {translate('AccountImport.connectToYourWallet')}
        <ButtonHome />
      </Header>

      <View>
        <p>{translate('AccountImport.enterYourSeedPhrase')}</p>

        <SpacingStyle>
          <TextareaStyle
            name="seedPhrase"
            value={seedPhrase}
            onChange={onChange}
          />
        </SpacingStyle>

        <p>
          {translate('AccountImport.lostYourSeedPhrase')}
          <br />

          <Link to="/welcome/onboarding">
            {translate('AccountImport.createNewWallet')}
          </Link>
        </p>

        <p>
          {translate('AccountImport.questions')}{' '}
          <a href={CONTACT_URL}>{translate('AccountImport.contactUs')}</a>
        </p>
      </View>

      <Footer>
        <Button disabled={!isValid} onClick={onClick}>
          {translate('AccountImport.submit')}
        </Button>
      </Footer>
    </Fragment>
  );
};

export default AccountImport;
