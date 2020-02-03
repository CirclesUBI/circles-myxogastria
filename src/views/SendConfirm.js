import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Redirect, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import ButtonHome from '~/components/ButtonHome';
import ProfileMini from '~/components/ProfileMini';
import View from '~/components/View';
import logError from '~/utils/debug';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { BackgroundOrangeTop } from '~/styles/Background';
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
      await dispatch(transfer(address, amount));

      dispatch(
        notify({
          text: context.t('SendConfirm.successMessage'),
        }),
      );

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

  if (isSent) {
    return <Redirect to="/" />;
  }

  if (isConfirmationShown) {
    return (
      <BackgroundOrangeTop>
        <SendConfirmHeader>
          <ButtonBack onClick={onPrevious} />
        </SendConfirmHeader>

        <View isFooter isHeader>
          <p>{context.t('SendConfirm.confirmationText', { amount })}</p>
          <ProfileMini address={address} />
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
        <ButtonBack to="/send" />
      </SendConfirmHeader>

      <View isFooter isHeader>
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
