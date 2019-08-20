import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Button from '~/components/Button';
import QRCode from '~/components/QRCode';
import { ensureSafeAddress } from '~/utils/state';

const Dashboard = (props, context) => {
  const safe = useSelector(state => state.safe);
  const safeAddress = ensureSafeAddress(safe);

  return (
    <Fragment>
      <Link to="/settings">
        <Button>{context.t('views.dashboard.settings')}</Button>
      </Link>

      <QRCode data={safeAddress} width={250} />
    </Fragment>
  );
};

Dashboard.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Dashboard;
