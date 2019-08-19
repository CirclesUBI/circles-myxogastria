import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';

const CreateNewAccount = (props, context) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChange = event => {
    setUsername(event.target.value);
  };

  const onSubmit = event => {
    event.preventDefault();

    setIsLoading(true);
  };

  return (
    <Fragment>
      <BackButton />

      <form>
        <label htmlFor="username">{context.t('views.create.username')}</label>
        <input id="username" type="text" value={username} onChange={onChange} />

        <Button disabled={isLoading} onClick={onSubmit}>
          {context.t('views.create.confirm')}
        </Button>
      </form>
    </Fragment>
  );
};

CreateNewAccount.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default CreateNewAccount;
