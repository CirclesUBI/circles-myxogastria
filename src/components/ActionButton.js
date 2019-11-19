import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';
import { ButtonStyle } from '~/components/Button';
import { IconReceive, IconExit, IconSend, IconTrust } from '~/styles/Icons';

const TRANSITION_DURATION = 500;

const ActionButton = () => {
  const [isExtended, setIsExtended] = useState(false);

  const onToggle = () => {
    setIsExtended(!isExtended);
  };

  return (
    <Fragment>
      <Overlay isExtended={isExtended} />

      <ToggleStyle isExtended={isExtended} onClick={onToggle}>
        <IconExit />
      </ToggleStyle>
    </Fragment>
  );
};

const Overlay = (props, context) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  useEffect(() => {
    if (props.isExtended) {
      setIsVisible(true);
    } else {
      window.setTimeout(() => {
        setIsVisible(false);
      }, TRANSITION_DURATION);
    }

    window.setTimeout(() => {
      setIsPanelVisible(props.isExtended);
    }, TRANSITION_DURATION / 20);
  }, [props.isExtended]);

  if (!isVisible) {
    return null;
  }

  return (
    <OverlayStyle isVisible={isPanelVisible}>
      <PanelStyle isVisible={isPanelVisible}>
        <PanelItemStyle>
          <PanelButtonStyle to="/send">
            <IconSend />
            <span>{context.t('ActionButton.send')}</span>
          </PanelButtonStyle>
        </PanelItemStyle>

        <PanelItemStyle>
          <PanelButtonStyle to="/trust">
            <IconTrust />
            <span>{context.t('ActionButton.trust')}</span>
          </PanelButtonStyle>
        </PanelItemStyle>

        <PanelItemStyle>
          <PanelButtonStyle to="/receive">
            <IconReceive />
            <span>{context.t('ActionButton.receive')}</span>
          </PanelButtonStyle>
        </PanelItemStyle>
      </PanelStyle>
    </OverlayStyle>
  );
};

Overlay.propTypes = {
  isExtended: PropTypes.bool.isRequired,
};

Overlay.contextTypes = {
  t: PropTypes.func.isRequired,
};

const actionButtonSize = '6rem';
const panelHeight = '12rem';

const gradient = `linear-gradient(
  90deg,
  ${styles.colors.primary} 0%,
  ${styles.colors.accentAlternative} 100%
)`;

const ActionButtonStyle = styled(ButtonStyle)`
  width: ${actionButtonSize};
  height: ${actionButtonSize};

  border-radius: 50%;

  color: ${styles.components.button.color};

  background: ${gradient};

  box-shadow: 0 0 25px ${styles.monochrome.gray};
`;

const ToggleStyle = styled(ActionButtonStyle)`
  position: absolute;

  right: 2rem;
  bottom: 2rem;

  z-index: ${styles.zIndex.actionButton};

  font-weight: ${styles.base.typography.weightSemiBold};
  font-size: 2.5em;

  transform: translate3d(
      ${props => {
        return props.isExtended ? '0, -14rem, 0' : '0, 0, 0';
      }}
    )
    rotate(
      ${props => {
        return props.isExtended ? '0deg' : '45deg';
      }}
    );
  transition: ${TRANSITION_DURATION}ms transform ease-in-out;

  ${IconExit} {
    position: relative;

    top: -4px;

    font-size: 2rem;
  }
`;

const OverlayStyle = styled.div`
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
      ? `rgba(255, 255, 255, 0.9)`
      : `rgba(255, 255, 255, 0)`;
  }};

  transition: ${TRANSITION_DURATION}ms background ease-in-out;
`;

const PanelStyle = styled.ul`
  position: absolute;

  right: 0;
  bottom: 0;
  left: 0;

  display: flex;

  height: ${panelHeight};

  background: ${gradient};

  transform: ${props => {
    return props.isVisible
      ? 'translate3d(0, 0, 0)'
      : `translate3d(0, ${panelHeight}, 0)`;
  }};
  transition: ${TRANSITION_DURATION}ms transform ease-in-out;
`;

const PanelItemStyle = styled.li`
  flex: 1;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const PanelButtonStyle = styled(ButtonStyle)`
  display: flex;

  width: 100%;
  height: 100%;

  color: ${styles.components.button.color};

  align-items: center;
  flex-direction: column;
  justify-content: center;

  ${/* sc-selector */ IconReceive},
  ${/* sc-selector */ IconSend},
  ${/* sc-selector */ IconTrust} {
    &::before {
      font-size: 5rem;
    }
  }

  span {
    margin-top: 1rem;

    font-weight: ${styles.base.typography.weightLight};
  }
`;

export default ActionButton;
