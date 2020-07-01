import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Redirect, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Bubble from '~/components/Bubble';
import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import ProfileMini from '~/components/ProfileMini';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import core from '~/services/core';
import logError, { formatErrorMessage } from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { BackgroundOrangeCircle } from '~/styles/Background';
import { InputNumberStyle } from '~/styles/Inputs';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { transfer } from '~/store/token/actions';

import Header, {
  HeaderCenterStyle,
  HeaderTitleStyle,
} from '~/components/Header';

const SendConfirm = (props, context) => {
  const { address } = props.match.params;

  const [amount, setAmount] = useState(0);
  const [isConfirmationShown, setIsConfirmationShown] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const dispatch = useDispatch();

  const onAmountChange = (event) => {
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
      await dispatch(transfer(address, amount));

      dispatch(
        notify({
          text: context.t('SendConfirm.successMessage'),
        }),
      );

      setIsSent(true);
    } catch (error) {
      logError(error);
      let text;

      if (error instanceof core.errors.TransferError) {
        text = context.t('SendConfirm.errorMessageTransfer');
      } else {
        const errorMessage = formatErrorMessage(error);
        text = `${context.t('SendConfirm.errorMessage')}${errorMessage}`;
      }

      dispatch(
        notify({
          text,
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  if (isSent) {
    return <Redirect to="/" />;
  }

  if (isConfirmationShown) {
    return (
      <BackgroundOrangeCircle isWithCircle>
        <SendConfirmHeader>
          <ButtonBack onClick={onPrevious} />
        </SendConfirmHeader>

        <View isCentered isFooter isHeader>
          <Bubble>
            <p>
              {context.t('SendConfirm.confirmationText', { amount })}
              <UsernameDisplay address={address} />
              {context.t('SendConfirm.confirmationTextAfter')}
            </p>
          </Bubble>
        </View>

        <Footer>
          <ButtonPrimary onClick={onSubmit}>
            {context.t('SendConfirm.confirm')}
          </ButtonPrimary>
        </Footer>
      </BackgroundOrangeCircle>
    );
  }

  return (
    <BackgroundOrangeCircle isWithCircle>
      <SendConfirmHeader>
        <ButtonBack to="/send" />
      </SendConfirmHeader>

      <View isCentered isFooter isHeader>
        <ConfirmToStyle>
          <span>{context.t('SendConfirm.to')}</span>
          <ProfileMini address={address} />
        </ConfirmToStyle>

        <p>{context.t('SendConfirm.howMuch')}</p>

        <InputNumberStyle
          type="number"
          value={amount}
          onChange={onAmountChange}
        />
      </View>

      <Footer>
        <ButtonPrimary disabled={!(amount > 0)} onClick={onNext}>
          {context.t('SendConfirm.submitAmount')}
        </ButtonPrimary>
      </Footer>
    </BackgroundOrangeCircle>
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

      <ButtonHome />
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
