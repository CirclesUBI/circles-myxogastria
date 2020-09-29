import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { generatePath } from 'react-router';

import Finder from '~/components/Finder';
import { PROFILE_PATH } from '~/routes';

const TrustNetwork = () => {
  const [redirectPath, setRedirectPath] = useState(null);

  const handleSelect = (address) => {
    setRedirectPath(
      generatePath(PROFILE_PATH, {
        address,
      }),
    );
  };

  if (redirectPath) {
    return <Redirect push to={redirectPath} />;
  }

  return <Finder hasActions onSelect={handleSelect} />;
};

export default TrustNetwork;
