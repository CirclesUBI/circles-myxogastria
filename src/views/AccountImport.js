import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import View from '~/components/View';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { CONTACT_URL } from '~/components/ExternalLinkList';
import { SpacingStyle } from '~/styles/Layout';
import { TextareaStyle } from '~/styles/Inputs';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { restoreAccount } from '~/store/onboarding/actions';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const AccountImport = (props, context) => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const dispatch = useDispatch();

  const onChange = event => {
    setSeedPhrase(event.target.value);
  };

  const onClick = async () => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(restoreAccount(seedPhrase));

      dispatch(
        notify({
          text: context.t('AccountImport.welcomeMessage'),
        }),
      );
    } catch {
      dispatch(
        notify({
          text: context.t('AccountImport.errorMessage'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  return (
    <Fragment>
      <Header>
        <ButtonBack isDark to="/welcome/connect" />

        <HeaderCenterStyle>
          <HeaderTitleStyle isDark>
            {context.t('AccountImport.connectToYourWallet')}
          </HeaderTitleStyle>
        </HeaderCenterStyle>

        <ButtonHome isDark />
      </Header>

      <View isFooter isHeader>
        <p>{context.t('AccountImport.enterYourSeedPhrase')}</p>

        <SpacingStyle>
          <TextareaStyle value={seedPhrase} onChange={onChange} />
        </SpacingStyle>

        <p>
          {context.t('AccountImport.lostYourSeedPhrase')}
          <br />

          <Link to="/welcome/new">
            {context.t('AccountImport.createNewWallet')}
          </Link>
        </p>

        <p>
          {context.t('AccountImport.questions')}{' '}
          <a href={CONTACT_URL}>{context.t('AccountImport.contactUs')}</a>
        </p>
      </View>

      <Footer>
        <ButtonPrimary disabled={seedPhrase.length === 0} onClick={onClick}>
          {context.t('AccountImport.submit')}
        </ButtonPrimary>
      </Footer>
    </Fragment>
  );
};

AccountImport.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default AccountImport;
