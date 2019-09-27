import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';
import Header from '~/components/Header';
import QRCode from '~/components/QRCode';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';

const Settings = (props, context) => {
  const safe = useSelector(state => state.safe);

  return (
    <Fragment>
      <Header>
        <BackButton to="/" />
        <UsernameDisplay address={safe.address} />
      </Header>

      <View>
        <QRCode data={safe.address} width={250} />

        <Link to="/settings/share">
          <Button>{context.t('views.settings.share')}</Button>
        </Link>

        <Link to="/settings/keys">
          <Button>{context.t('views.settings.keys')}</Button>
        </Link>

        <Link to="/settings/locale">
          <Button>{context.t('views.settings.locale')}</Button>
        </Link>

        <ul>
          <li>
            <a href="#" target="_blank">
              {context.t('views.settings.marketplace')}
            </a>
          </li>

          <li>
            <a href="#" target="_blank">
              {context.t('views.settings.meetups')}
            </a>
          </li>

          <li>
            <a href="#" target="_blank">
              {context.t('views.settings.about')}
            </a>
          </li>

          <li>
            <a href="#" target="_blank">
              {context.t('views.settings.contact')}
            </a>
          </li>
        </ul>
      </View>
    </Fragment>
  );
};

Settings.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Settings;
