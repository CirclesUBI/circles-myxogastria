import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';
import { restoreWallet } from '~/store/wallet/actions';

const FromSeedPhrase = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const dispatch = useDispatch();

  const onChange = event => {
    setSeedPhrase(event.target.value);
  };

  const onClick = () => {
    dispatch(restoreWallet(seedPhrase));
  };

  return (
    <Fragment>
      <BackButton />
      <textarea value={seedPhrase} onChange={onChange} />
      <Button onClick={onClick}>Restore</Button>
    </Fragment>
  );
};

export default FromSeedPhrase;
