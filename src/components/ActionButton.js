import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';
import ButtonStyle from '~/components/Button';

const ActionButton = () => {
  const [isActive, setIsActive] = useState(false);

  const onToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <Fragment>
      <ActionButtonOverlay isActive={isActive} />
      <ActionButtonMainStyle onClick={onToggle}>+</ActionButtonMainStyle>
    </Fragment>
  );
};

const ActionButtonOverlay = props => {
  if (!props.isActive) {
    return null;
  }

  return (
    <ActionButtonOverlayStyle>
      <ActionButtonTrustStyle to="/trust">Trust</ActionButtonTrustStyle>
      <ActionButtonReceiveStyle to="/receive">Receive</ActionButtonReceiveStyle>
      <ActionButtonSendStyle to="/send">Send</ActionButtonSendStyle>
    </ActionButtonOverlayStyle>
  );
};

ActionButtonOverlay.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

const ActionButtonStyle = styled(ButtonStyle)`
  position: absolute;

  z-index: ${styles.zIndex.actionButton};

  width: 6rem;
  height: 6rem;

  border-radius: 50%;

  color: ${styles.components.button.color};

  background-color: ${styles.colors.primary};

  box-shadow: 0 0 ${styles.shadow.blur} ${styles.shadow.color};
`;

const ActionButtonMainStyle = styled(ActionButtonStyle)`
  right: 2rem;
  bottom: 2rem;
`;

const ActionButtonOverlayStyle = styled.div`
  @media ${styles.device.desktop} {
    border-radius: ${styles.border.radius};
  }

  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: ${styles.zIndex.actionButtonOverlay};

  background-color: ${styles.colors.secondary};
`;

const ActionButtonTrustStyle = styled(ActionButtonStyle)`
  right: 10rem;
  bottom: 10rem;
`;

const ActionButtonReceiveStyle = styled(ActionButtonStyle)`
  right: 4rem;
  bottom: 14rem;
`;

const ActionButtonSendStyle = styled(ActionButtonStyle)`
  right: 14rem;
  bottom: 4rem;
`;

export default ActionButton;
