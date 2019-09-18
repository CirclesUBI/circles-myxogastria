import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Button from '~/components/Button';
import QRCode from '~/components/QRCode';

const Dashboard = (props, context) => {
  const safe = useSelector(state => state.safe);

  return (
    <Fragment>
      <Link to="/settings">
        <Button>{context.t('views.dashboard.settings')}</Button>
      </Link>

      <QRCode data={safe.address} width={250} />
    </Fragment>
  );
};

Dashboard.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Dashboard;
