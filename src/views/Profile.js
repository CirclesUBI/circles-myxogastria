import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';

import BackButton from '~/components/BackButton';
import Button from '~/components/Button';
import ClipboardButton from '~/components/ClipboardButton';
import Header from '~/components/Header';
import QRCode from '~/components/QRCode';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';

const Profile = (props, context) => {
  const { address } = props.match.params;
  const profileAddress = `${process.env.BASE_PATH}/profile/${address}`;

  return (
    <Fragment>
      <Header>
        <BackButton to="/" />
      </Header>

      <View>
        <UsernameDisplay address={address} />
        <QRCode data={address} width={250} />

        <ClipboardButton text={profileAddress}>
          {context.t('Profile.copyToClipboard')}
        </ClipboardButton>

        <Button to={`/send/${address}`}>{context.t('Profile.send')}</Button>
      </View>
    </Fragment>
  );
};

Profile.contextTypes = {
  t: PropTypes.func.isRequired,
};

Profile.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withRouter(Profile);
