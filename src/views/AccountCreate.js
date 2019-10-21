import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
import Header from '~/components/Header';
import Logo from '~/components/Logo';
import View from '~/components/View';
import logError from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { InputStyle, FieldsetStyle, LabelStyle } from '~/styles/Inputs';
import { SpacingStyle } from '~/styles/Layout';
import { createNewAccount } from '~/store/onboarding/actions';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';

const AccountCreate = (props, context) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');

  const onChange = event => {
    setUsername(event.target.value);
  };

  const onSubmit = async () => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(createNewAccount(username));

      dispatch(
        notify({
          text: context.t('AccountCreate.welcomeMessage'),
        }),
      );
    } catch (error) {
      dispatch(
        notify({
          text: context.t('AccountCreate.errorMessage'),
          type: NotificationsTypes.ERROR,
        }),
      );

      logError(error);
    }

    dispatch(hideSpinnerOverlay());
  };

  return (
    <Fragment>
      <Header>
        <BackButton isDark to="/welcome" />
      </Header>

      <View isHeader>
        <Logo />

        <SpacingStyle>
          <h1>{context.t('AccountCreate.createYourUsername')}</h1>
        </SpacingStyle>

        <p>{context.t('AccountCreate.yourUsernameDescription')}</p>

        <SpacingStyle>
          <FieldsetStyle>
            <LabelStyle htmlFor="username">
              {context.t('AccountCreate.username')}
            </LabelStyle>

            <InputStyle
              id="username"
              required
              type="text"
              value={username}
              onChange={onChange}
            />
          </FieldsetStyle>
        </SpacingStyle>

        <ButtonPrimary type="submit" onClick={onSubmit}>
          {context.t('AccountCreate.submit')}
        </ButtonPrimary>
      </View>
    </Fragment>
  );
};

AccountCreate.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default AccountCreate;
