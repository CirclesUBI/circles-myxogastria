import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import QRCode from '~/components/QRCode';
import View from '~/components/View';
import { SpacingStyle } from '~/styles/Layout';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const AccountConnect = (props, context) => {
  const { address } = useSelector(state => state.wallet);

  return (
    <Fragment>
      <Header>
        <BackButton isDark to="/welcome" />

        <HeaderCenterStyle>
          <HeaderTitleStyle isDark>
            {context.t('AccountConnect.connectToYourWallet')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>
      </Header>

      <View isFooter isHeader>
        <QRCode data={address} />

        <p>
          {context.t('AccountConnect.noSeedPhrase')}{' '}
          <Link to="/welcome/new">
            {context.t('AccountConnect.createNewWallet')}
          </Link>
        </p>

        <p>
          {context.t('AccountConnect.questions')}{' '}
          <a href="#">{context.t('AccountConnect.contactUs')}</a>
        </p>
      </View>

      <Footer>
        <ButtonPrimary to="/welcome/seed">
          {context.t('AccountConnect.restoreWithSeedPhrase')}
        </ButtonPrimary>
      </Footer>
    </Fragment>
  );
};

AccountConnect.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default AccountConnect;
