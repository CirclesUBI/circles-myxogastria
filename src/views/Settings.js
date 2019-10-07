import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';
import ExternalLinkList from '~/components/ExternalLinkList';
import Header from '~/components/Header';
import LocaleSelector from '~/components/LocaleSelector';
import QRCode from '~/components/QRCode';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import { finalizeNewAccount } from '~/store/onboarding/actions';

const Settings = (props, context) => {
  const safe = useSelector(state => state.safe);
  const dispatch = useDispatch();

  // @TODO: Remove this when we've implemented all of the onboarding flows
  const onDeploy = () => {
    dispatch(finalizeNewAccount());
  };

  return (
    <Fragment>
      <Header>
        <BackButton to="/" />
        <UsernameDisplay address={safe.address} />
      </Header>

      <View>
        <QRCode data={safe.address} width={250} />

        <Link to="/settings/share">
          <Button>{context.t('Settings.share')}</Button>
        </Link>

        <Link to="/settings/keys">
          <Button>{context.t('Settings.manageKeys')}</Button>
        </Link>

        <Button onClick={onDeploy}>Debug: Deploy Safe</Button>

        <LocaleSelector />
        <ExternalLinkList />
      </View>
    </Fragment>
  );
};

Settings.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Settings;
