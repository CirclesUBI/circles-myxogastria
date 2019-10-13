import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';
import logError from '~/services/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { createNewAccount } from '~/store/onboarding/actions';

const AccountCreate = (props, context) => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChange = event => {
    setUsername(event.target.value);
  };

  const onSubmit = async event => {
    event.preventDefault();

    setIsLoading(true);

    try {
      await dispatch(createNewAccount(username));

      dispatch(
        notify({
          text: context.t('AccountCreate.welcomeMessage'),
        }),
      );
    } catch (error) {
      setIsLoading(false);

      dispatch(
        notify({
          text: context.t('AccountCreate.errorMessage'),
          type: NotificationsTypes.ERROR,
        }),
      );

      logError(error);
    }
  };

  return (
    <Fragment>
      <Header>
        <BackButton disabled={isLoading} to="/welcome" />
      </Header>

      <View>
        <h1>{context.t('AccountCreate.createYourUsername')}</h1>
        <p>{context.t('AccountCreate.yourUsernameDescription')}</p>

        <form>
          <label htmlFor="username">
            {context.t('AccountCreate.username')}
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={onChange}
          />
        </form>
      </View>

      <Footer>
        <ButtonPrimary disabled={isLoading} onClick={onSubmit}>
          {context.t('AccountCreate.submit')}
        </ButtonPrimary>
      </Footer>
    </Fragment>
  );
};

AccountCreate.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default AccountCreate;
