import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Redirect, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import BackButton from '~/components/BackButton';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import HomeButton from '~/components/HomeButton';
import MiniProfile from '~/components/MiniProfile';
import View from '~/components/View';
import logError from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { BackgroundOrangeTop } from '~/styles/Background';
import { InputNumberStyle } from '~/styles/Inputs';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { resolveUsernames } from '~/services/username';
import { transferCircles, checkCurrentBalance } from '~/store/token/actions';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const SendConfirm = (props, context) => {
  const { address } = props.match.params;

  const [amount, setAmount] = useState(0);
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [receiver, setReceiver] = useState(address);

  const dispatch = useDispatch();

  const resolveAddress = safeAddress => {
    resolveUsernames([safeAddress]).then(result => {
      if (safeAddress in result) {
        setReceiver(result[safeAddress]);
      }
    });
  };

  const onAmountChange = event => {
    setAmount(event.target.value);
  };

  const onNext = () => {
    setIsConfirmationShown(true);
  };

  const onPrevious = () => {
    setIsConfirmationShown(false);
  };

  const onSubmit = async () => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(transferCircles(address, amount));

      dispatch(
        notify({
          text: context.t('SendConfirm.successMessage'),
        }),
      );

      await dispatch(checkCurrentBalance());

      setIsSent(true);
    } catch (error) {
      logError(error);

      dispatch(
        notify({
          text: context.t('SendConfirm.errorMessage'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  useEffect(resolveAddress, [address]);

  if (isSent) {
    return <Redirect to="/" />;
  }

  if (isConfirmationShown) {
    return (
      <BackgroundOrangeTop>
        <SendConfirmHeader>
          <BackButton onClick={onPrevious} />
        </SendConfirmHeader>

        <View isFooter isHeader>
          <p>
            {context.t('SendConfirm.confirmationText', { receiver, amount })}
          </p>
        </View>

        <Footer>
          <ButtonPrimary onClick={onSubmit}>
            {context.t('SendConfirm.confirm')}
          </ButtonPrimary>
        </Footer>
      </BackgroundOrangeTop>
    );
  }

  return (
    <BackgroundOrangeTop>
      <SendConfirmHeader>
        <BackButton to="/send" />
      </SendConfirmHeader>

      <View isFooter isHeader>
        <ConfirmToStyle>
          <span>{context.t('SendConfirm.to')}</span>
          <MiniProfile address={address} />
        </ConfirmToStyle>

        <p>{context.t('SendConfirm.howMuch')}</p>

        <InputNumberStyle
          type="number"
          value={amount}
          onChange={onAmountChange}
        />
      </View>

      <Footer>
        <ButtonPrimary disabled={!amount > 0} onClick={onNext}>
          {context.t('SendConfirm.submitAmount')}
        </ButtonPrimary>
      </Footer>
    </BackgroundOrangeTop>
  );
};

const SendConfirmHeader = (props, context) => {
  return (
    <Header>
      {props.children}

      <HeaderCenterStyle>
        <HeaderTitleStyle>
          {context.t('SendConfirm.sendCircles')}
        </HeaderTitleStyle>
      </HeaderCenterStyle>

      <HomeButton />
    </Header>
  );
};

SendConfirm.contextTypes = {
  t: PropTypes.func.isRequired,
};

SendConfirm.propTypes = {
  match: PropTypes.object.isRequired,
};

SendConfirmHeader.contextTypes = {
  t: PropTypes.func.isRequired,
};

SendConfirmHeader.propTypes = {
  children: PropTypes.any.isRequired,
};

const ConfirmToStyle = styled.div`
  display: flex;

  margin-bottom: 2rem;

  align-items: center;
  justify-content: center;

  span {
    margin-right: 1rem;
  }
`;

export default withRouter(SendConfirm);
