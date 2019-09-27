import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';
import Header from '~/components/Header';
import View from '~/components/View';
import { restoreAccount } from '~/store/onboarding/actions';

const AccountImport = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const dispatch = useDispatch();

  const onChange = event => {
    setSeedPhrase(event.target.value);
  };

  const onClick = () => {
    dispatch(restoreAccount(seedPhrase));
  };

  return (
    <Fragment>
      <Header>
        <BackButton to="/welcome/connect" />
      </Header>

      <View>
        <textarea value={seedPhrase} onChange={onChange} />
        <Button onClick={onClick}>Restore</Button>
      </View>
    </Fragment>
  );
};

export default AccountImport;
