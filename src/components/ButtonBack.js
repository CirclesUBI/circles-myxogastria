import React from 'react';
import { IconButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { IconBack } from '~/styles/icons';

const ButtonBack = (props) => {
  const history = useHistory();

  const onClick = () => {
    history.goBack();
  };

  return (
    <IconButton {...props} aria-label="Return" onClick={onClick}>
      <IconBack />
    </IconButton>
  );
};

export default ButtonBack;
