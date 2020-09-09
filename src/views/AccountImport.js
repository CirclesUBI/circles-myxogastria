import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { CONTACT_URL } from '~/components/ExternalLinkList';
import { SpacingStyle } from '~/styles/Layout';
import { TextareaStyle } from '~/styles/Inputs';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { restoreAccount } from '~/store/onboarding/actions';

const AccountImport = (props, context) => {
  const [values, setValues] = useState({
    seedPhrase: '',
    nonce: '',
  });

  const dispatch = useDispatch();

  const onChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const onClick = async () => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(
        restoreAccount(
          values.seedPhrase,
          values.nonce.length > 0 ? parseInt(values.nonce, 10) : null,
        ),
      );

      dispatch(
        notify({
          text: context.t('AccountImport.welcomeMessage'),
        }),
      );

      dispatch(hideSpinnerOverlay());
    } catch (error) {
      console.error(error);

      dispatch(
        notify({
          text: context.t('AccountImport.errorMessage'),
          type: NotificationsTypes.ERROR,
          lifetime: 10000,
        }),
      );

      dispatch(hideSpinnerOverlay());
    }
  };

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/welcome/connect" />
        {context.t('AccountImport.connectToYourWallet')}
        <ButtonHome />
      </Header>

      <View>
        <p>{context.t('AccountImport.enterYourSeedPhrase')}</p>

        <SpacingStyle>
          <TextareaStyle
            name="seedPhrase"
            value={values.seedPhrase}
            onChange={onChange}
          />

          <p>Nonce</p>

          <input name="nonce" value={values.nonce} onChange={onChange} />
        </SpacingStyle>

        <p>
          {context.t('AccountImport.lostYourSeedPhrase')}
          <br />

          <Link to="/welcome/onboarding">
            {context.t('AccountImport.createNewWallet')}
          </Link>
        </p>

        <p>
          {context.t('AccountImport.questions')}{' '}
          <a href={CONTACT_URL}>{context.t('AccountImport.contactUs')}</a>
        </p>
      </View>

      <Footer>
        <ButtonPrimary
          disabled={values.seedPhrase.length === 0}
          onClick={onClick}
        >
          {context.t('AccountImport.submit')}
        </ButtonPrimary>
      </Footer>
    </Fragment>
  );
};

AccountImport.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default AccountImport;
