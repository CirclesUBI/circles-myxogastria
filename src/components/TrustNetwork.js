import React from 'react';
import { useHistory } from 'react-router-dom';
import { generatePath } from 'react-router';

import Finder from '~/components/Finder';
import { PROFILE_PATH } from '~/routes';

const TrustNetwork = () => {
  const history = useHistory();

  const handleSelect = (address) => {
    const path = generatePath(PROFILE_PATH, {
      address,
    });
    history.push(path);
  };

  return <Finder onSelect={handleSelect} />;
};

export default TrustNetwork;
