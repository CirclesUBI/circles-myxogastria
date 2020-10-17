import React from 'react';
import { IconButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { DASHBOARD_PATH } from '~/routes';
import { IconBack } from '~/styles/icons';

const ButtonBack = (props) => {
  const history = useHistory();

  const onClick = () => {
    // Is this the first page we visited so far? Then always redirect to home
    // when going back even though there is no history yet
    if (history.length === 1) {
      history.replace(DASHBOARD_PATH);
    } else {
      history.goBack();
    }
  };

  return (
    <IconButton {...props} aria-label="Return" edge="start" onClick={onClick}>
      <IconBack />
    </IconButton>
  );
};

export default ButtonBack;
