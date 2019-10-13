import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
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
      </Header>

      <View>
        <UsernameDisplay address={safe.address} />
        <QRCode data={safe.address} width={250} />

        <ButtonPrimary to="/settings/share">
          {context.t('Settings.share')}
        </ButtonPrimary>

        <ButtonPrimary to="/settings/keys">
          {context.t('Settings.manageKeys')}
        </ButtonPrimary>

        <ButtonPrimary disabled={!safe.nonce} onClick={onDeploy}>
          Debug: Deploy Safe
        </ButtonPrimary>

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
