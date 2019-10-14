import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import styles from '~/styles/variables';
import { ButtonStyle } from '~/components/Button';

const ActionButton = () => {
  const [isActive, setIsActive] = useState(false);

  const onToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <Fragment>
      <ActionButtonOverlay isActive={isActive} />

      <ActionButtonMainStyle isActive={isActive} onClick={onToggle}>
        {isActive ? 'x' : '+'}
      </ActionButtonMainStyle>
    </Fragment>
  );
};

const ActionButtonOverlay = (props, context) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  useEffect(() => {
    if (props.isActive) {
      setIsVisible(true);
    } else {
      window.setTimeout(() => {
        setIsVisible(false);
      }, 500);
    }

    window.setTimeout(() => {
      setIsPanelVisible(props.isActive);
    }, 25);
  }, [props.isActive]);

  if (!isVisible) {
    return null;
  }

  return (
    <ActionButtonOverlayStyle isVisible={isPanelVisible}>
      <ActionButtonPanelStyle isActive={isPanelVisible}>
        <ActionButtonPanelItemStyle>
          <ActionButtonPanelIconStyle to="/send">
            <i className="icon-send" />
            <span>{context.t('ActionButton.send')}</span>
          </ActionButtonPanelIconStyle>
        </ActionButtonPanelItemStyle>

        <ActionButtonPanelItemStyle>
          <ActionButtonPanelIconStyle to="/trust">
            <i className="icon-trust" />
            <span>{context.t('ActionButton.trust')}</span>
          </ActionButtonPanelIconStyle>
        </ActionButtonPanelItemStyle>

        <ActionButtonPanelItemStyle>
          <ActionButtonPanelIconStyle to="/receive">
            <i className="icon-receive" />
            <span>{context.t('ActionButton.receive')}</span>
          </ActionButtonPanelIconStyle>
        </ActionButtonPanelItemStyle>
      </ActionButtonPanelStyle>
    </ActionButtonOverlayStyle>
  );
};

const ActionButtonBase = props => {
  if (props.to) {
    return (
      <Link to={props.to}>
        <ActionButtonBaseStyle isActive={props.isActive}>
          {props.children}
        </ActionButtonBaseStyle>
      </Link>
    );
  }

  return (
    <ActionButtonBaseStyle isActive={props.isActive} onClick={props.onClick}>
      {props.children}
    </ActionButtonBaseStyle>
  );
};

ActionButtonBase.propTypes = {
  children: PropTypes.any.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

ActionButtonOverlay.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

ActionButtonOverlay.contextTypes = {
  t: PropTypes.func.isRequired,
};

const transitionDuration = '0.5s';

const ActionButtonBaseStyle = styled(ButtonStyle)`
  width: 6rem;
  height: 6rem;

  border-radius: 50%;

  color: ${styles.components.button.color};

  background: linear-gradient(90deg, #cc1e66 0%, #faad26 100%);

  box-shadow: 0 0 25px ${styles.colors.shadow};
`;

const ActionButtonMainStyle = styled(ActionButtonBaseStyle)`
  position: absolute;

  right: 2rem;
  bottom: 2rem;

  z-index: ${styles.zIndex.actionButton};

  font-weight: ${styles.base.typography.weightSemiBold};
  font-size: 2.5em;

  transform: ${props => {
    return props.isActive
      ? 'translate3d(0, -14rem, 0)'
      : 'translate3d(0, 0, 0)';
  }};
  transition: ${transitionDuration} transform ease-in-out;
`;

const ActionButtonOverlayStyle = styled.div`
  @media ${styles.media.desktop} {
    border-radius: ${styles.base.layout.borderRadius};
  }

  position: absolute;

  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  z-index: ${styles.zIndex.actionButtonOverlay};

  overflow: hidden;

  background: ${props => {
    return props.isVisible
      ? 'rgba(255, 255, 255, 0.9)'
      : 'rgba(255, 255, 255, 0)';
  }};

  transition: ${transitionDuration} background ease-in-out;
`;

const ActionButtonPanelStyle = styled.ul`
  position: absolute;

  right: 0;
  bottom: 0;
  left: 0;

  display: flex;

  height: 12rem;

  background: linear-gradient(90deg, #cc1e66 0%, #faad26 100%);

  transform: ${props => {
    return props.isActive ? 'translate3d(0, 0, 0)' : 'translate3d(0, 12rem, 0)';
  }};
  transition: ${transitionDuration} transform ease-in-out;
`;

const ActionButtonPanelItemStyle = styled.li`
  width: 33.33%;

  flex: 1;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ActionButtonPanelIconStyle = styled(ButtonStyle)`
  display: flex;

  width: 100%;
  height: 100%;

  color: ${styles.components.button.color};

  flex-direction: column;
  justify-content: center;

  i::before {
    font-size: 5rem;
  }

  span {
    margin-top: 1rem;

    font-weight: ${styles.base.typography.weightLight};
  }
`;

export default ActionButton;
