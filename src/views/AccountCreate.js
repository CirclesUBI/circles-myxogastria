import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import Button from '~/components/Button';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import Logo from '~/components/Logo';
import View from '~/components/View';
import logError from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import translate from '~/services/locale';
import { InputStyle, FieldsetStyle, LabelStyle } from '~/styles/Inputs';
import { SpacingStyle } from '~/styles/Layout';
import { createNewAccount } from '~/store/onboarding/actions';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';

const AccountCreate = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [email, setEMail] = useState('');

  const onChange = (event) => {
    const { name, value } = event.target;

    if (name === 'username') {
      setUsername(value);
    } else if (name === 'email') {
      setEMail(value);
    }
  };

  const onSubmit = async () => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(createNewAccount(username, email));

      dispatch(
        notify({
          text: translate('AccountCreate.welcomeMessage'),
        }),
      );
    } catch (error) {
      let text = translate('AccountCreate.errorMessage');

      if (error.message.includes('409')) {
        text = translate('AccountCreate.errorExistsAlready');
      } else if (
        error.message.includes('400') ||
        error.message.includes('invalid type')
      ) {
        text = translate('AccountCreate.errorLengthOrFormat');
      }

      dispatch(
        notify({
          text,
          type: NotificationsTypes.ERROR,
          lifetime: 10000,
        }),
      );

      logError(error);
    }

    dispatch(hideSpinnerOverlay());
  };

  return (
    <Fragment>
      <Header>
        <ButtonBack to="/welcome" />
      </Header>

      <View>
        <SpacingStyle isLargeTop>
          <Logo isWithGang />
        </SpacingStyle>

        <SpacingStyle>
          <h1>{translate('AccountCreate.createYourUsername')}</h1>
        </SpacingStyle>

        <SpacingStyle>
          <p>{translate('AccountCreate.yourUsernameDescription')}</p>
        </SpacingStyle>

        <FieldsetStyle>
          <LabelStyle htmlFor="username">
            {translate('AccountCreate.username')}
          </LabelStyle>

          <InputStyle
            id="username"
            name="username"
            required
            type="text"
            value={username}
            onChange={onChange}
          />
        </FieldsetStyle>

        <FieldsetStyle>
          <LabelStyle htmlFor="email">
            {translate('AccountCreate.email')}
          </LabelStyle>

          <InputStyle
            id="email"
            name="email"
            required
            type="email"
            value={email}
            onChange={onChange}
          />
        </FieldsetStyle>
      </View>

      <Footer>
        <Button
          disabled={username.length < 3 || email.length === 0}
          type="submit"
          onClick={onSubmit}
        >
          {translate('AccountCreate.submit')}
        </Button>
      </Footer>
    </Fragment>
  );
};

export default AccountCreate;
