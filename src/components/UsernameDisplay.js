import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import resolveUsernames from '~/services/username';

const UsernameDisplay = props => {
  const [username, setUsername] = useState('');

  const resolveAddress = () => {
    resolveUsernames([props.address]).then(result => {
      setUsername(result[props.address]);
    });
  };

  useEffect(resolveAddress, [props.address]);

  return username ? `@${username}` : props.address.slice(0, 10);
};

UsernameDisplay.propTypes = {
  address: PropTypes.string.isRequired,
};

export default UsernameDisplay;
