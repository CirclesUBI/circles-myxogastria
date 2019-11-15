import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import ButtonPrimary from '~/components/ButtonPrimary';
import ClipboardButton from '~/components/ClipboardButton';
import MiniProfile from '~/components/MiniProfile';
import RoundButton, { RoundButtonStyle } from '~/components/RoundButton';
import styles from '~/styles/variables';
import { BackgroundGreenBottom } from '~/styles/Background';
import { IconSend, IconTrust } from '~/styles/Icons';
import { InputStyle } from '~/styles/Inputs';

const ProfileBox = (props, context) => {
  const { network } = useSelector(state => state.trust);

  const connection = network.find(item => {
    return item.safeAddress === props.address;
  });

  return (
    <ProfileBoxStyle isTrustedByMe={connection && connection.isTrustedByMe}>
      <ProfileBoxHeaderStyle>
        <MiniProfile address={props.address} isInline isLarge />
        <TrustState connection={connection} />
      </ProfileBoxHeaderStyle>

      <ProfileBoxActionsStyle>
        <SendButton address={props.address} />
        <TrustButton address={props.address} connection={connection} />
      </ProfileBoxActionsStyle>

      <ProfileContentStyle>
        <p>{context.t('ProfileBox.publicAddress')}</p>
        <InputStyle readOnly value={props.address} />
        <ClipboardButton isPrimary text={props.address} />
        <RevokeTrustButton connection={connection} />
      </ProfileContentStyle>
    </ProfileBoxStyle>
  );
};

const SendButton = ({ address }, context) => {
  const safe = useSelector(state => state.safe);
  const disabled = safe.address === address;

  return (
    <RoundButton disabled={disabled} to={`/send/${address}`}>
      <IconSend />
      <span>{context.t('ProfileBox.sendCircles')}</span>
    </RoundButton>
  );
};

const TrustButton = ({ connection, address }, context) => {
  const safe = useSelector(state => state.safe);

  if (safe.address === address) {
    return null;
  }

  if (connection && connection.isTrustedByMe) {
    return (
      <RoundButton disabled isConfirmed>
        <IconTrust />
        <span>{context.t('ProfileBox.isTrusted')}</span>
      </RoundButton>
    );
  }

  return (
    <RoundButton to={`/trust/${address}`}>
      <IconTrust />
      <span>{context.t('ProfileBox.trustUser')}</span>
    </RoundButton>
  );
};

const RevokeTrustButton = ({ connection }, context) => {
  if (!connection || !connection.isTrustedByMe) {
    return null;
  }

  const safe = useSelector(state => state.safe);

  if (safe.address === connection.safeAddress) {
    return null;
  }

  return (
    <ButtonPrimary isOutline to={`/trust/revoke/${connection.safeAddress}`}>
      {context.t('ProfileBox.revokeTrustUser')}
    </ButtonPrimary>
  );
};
const TrustState = ({ connection }, context) => {
  if (!connection || !connection.isTrustingMe) {
    return null;
  }

  if (connection.isTrustedByMe) {
    return (
      <TrustStateStyle isMutual>
        {context.t('ProfileBox.isMutualTrust')}
      </TrustStateStyle>
    );
  }

  return (
    <TrustStateStyle>{context.t('ProfileBox.isTrustingYou')}</TrustStateStyle>
  );
};

ProfileBox.contextTypes = {
  t: PropTypes.func.isRequired,
};

ProfileBox.propTypes = {
  address: PropTypes.string.isRequired,
};

SendButton.contextTypes = {
  t: PropTypes.func.isRequired,
};

SendButton.propTypes = {
  address: PropTypes.string.isRequired,
};

TrustButton.contextTypes = {
  t: PropTypes.func.isRequired,
};

TrustButton.propTypes = {
  address: PropTypes.string.isRequired,
  connection: PropTypes.object,
};

RevokeTrustButton.contextTypes = {
  t: PropTypes.func.isRequired,
};

RevokeTrustButton.propTypes = {
  connection: PropTypes.object,
};

TrustState.contextTypes = {
  t: PropTypes.func.isRequired,
};

TrustState.propTypes = {
  connection: PropTypes.object,
};

const ProfileBoxStyle = styled(BackgroundGreenBottom)`
  height: ${props => {
    return props.isTrustedByMe ? '39rem' : '34rem';
  }};

  padding: 1rem;

  border-radius: 5px;

  background-color: ${styles.monochrome.white};

  text-align: left;

  box-shadow: 0 0 10px ${styles.monochrome.grayDarker};
`;

const ProfileBoxHeaderStyle = styled.div`
  display: flex;

  align-items: center;
`;

const TrustStateStyle = styled.span`
  margin-left: 0.5rem;
  padding: 0.2rem;
  padding-right: 0.7rem;
  padding-left: 0.7rem;

  border-radius: 5px;

  color: ${props => {
    return props.isMutual
      ? styles.monochrome.white
      : styles.monochrome.grayDarker;
  }};

  background-color: ${props => {
    return props.isMutual
      ? styles.colors.secondary
      : styles.monochrome.grayLighter;
  }};

  font-weight: ${styles.base.typography.weightLight};
  font-size: 0.8em;
`;

const ProfileBoxActionsStyle = styled.div`
  display: flex;

  justify-content: center;

  ${RoundButtonStyle} {
    margin-right: 1rem;
    margin-left: 1rem;
  }
`;

const ProfileContentStyle = styled.div`
  max-width: 40rem;

  margin: 0 auto;
  margin-top: 2rem;

  text-align: center;
`;

export default ProfileBox;
