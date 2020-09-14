import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Avatar } from '@material-ui/core';
import { useSelector } from 'react-redux';

import AvatarWithQR from '~/components/AvatarWithQR';
import BalanceDisplay from '~/components/BalanceDisplay';
import Button from '~/components/Button';
import Header from '~/components/Header';
import UsernameDisplay from '~/components/UsernameDisplay';
import ValidationStatus from '~/components/ValidationStatus';
import View from '~/components/View';
import translate from '~/services/locale';
import { NEEDED_TRUST_CONNECTIONS } from '~/utils/constants';

const Validation = () => {
  const trust = useSelector((state) => state.trust);

  const leftTrustConnections = Math.max(
    0,
    NEEDED_TRUST_CONNECTIONS - trust.connections,
  );

  return (
    <Fragment>
      <Header>
        <Link to="/validation/share">
          <AvatarWithQR />
        </Link>

        <ValidationProfile />
        <Avatar>{leftTrustConnections}</Avatar>
      </Header>

      <View>
        <BalanceDisplay />
        <ValidationStatus />

        <Button to="/validation/share">
          {translate('Validation.buttonShare')}
        </Button>
      </View>
    </Fragment>
  );
};

const ValidationProfile = () => {
  const safe = useSelector((state) => state.safe);

  return (
    <Typography align="center" noWrap variant="h6">
      <UsernameDisplay address={safe.pendingAddress} />
    </Typography>
  );
};

export default Validation;
