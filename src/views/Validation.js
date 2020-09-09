import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Avatar } from '@material-ui/core';
import { useSelector } from 'react-redux';

import AvatarWithQR from '~/components/AvatarWithQR';
import BalanceDisplay from '~/components/BalanceDisplay';
import ButtonPrimary from '~/components/ButtonPrimary';
import Header from '~/components/Header';
import UsernameDisplay from '~/components/UsernameDisplay';
import ValidationStatus from '~/components/ValidationStatus';
import View from '~/components/View';
import { NEEDED_TRUST_CONNECTIONS } from '~/utils/constants';

const Validation = (props, context) => {
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

        <ButtonPrimary to="/validation/share">
          {context.t('Validation.buttonShare')}
        </ButtonPrimary>
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

Validation.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Validation;
