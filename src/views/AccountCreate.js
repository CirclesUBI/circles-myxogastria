import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';
import logError from '~/services/debug';
import notify from '~/store/notifications/actions';
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
          text: 'Welcome!', // @TODO
        }),
      );
    } catch (error) {
      // @TODO: Show error to user
      setIsLoading(false);
      logError(error);
    }
  };

  return (
    <Fragment>
      <Header>
        <BackButton disabled={isLoading} to="/welcome" />
      </Header>

      <View>
        <form>
          <label htmlFor="username">{context.t('views.create.username')}</label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={onChange}
          />
        </form>
      </View>

      <Footer>
        <Button disabled={isLoading} onClick={onSubmit}>
          {context.t('views.create.confirm')}
        </Button>
      </Footer>
    </Fragment>
  );
};

AccountCreate.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default AccountCreate;
