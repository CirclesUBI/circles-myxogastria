import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ZERO_ADDRESS } from '~/utils/constants';
import { useSelector, useDispatch } from 'react-redux';

import ButtonClipboard from '~/components/ButtonClipboard';
import ButtonPrimary from '~/components/ButtonPrimary';
import ButtonRound, { ButtonRoundStyle } from '~/components/ButtonRound';
import ProfileMini from '~/components/ProfileMini';
import core from '~/services/core';
import styles from '~/styles/variables';
import translate from '~/services/locale';
import { InputStyle } from '~/styles/Inputs';
import { checkTrustState } from '~/store/trust/actions';

const ProfileBox = (props) => {
  const [isDeployed, setIsDeployed] = useState(true);
  const { network } = useSelector((state) => state.trust);
  const dispatch = useDispatch();

  const connection = network.find((item) => {
    return item.safeAddress === props.address;
  });

  useEffect(() => {
    // Update trust connection info
    dispatch(checkTrustState());

    // Find out if Token is deployed
    const checkTokenDeployment = async () => {
      try {
        const tokenAddress = await core.token.getAddress(props.address);
        setIsDeployed(tokenAddress !== ZERO_ADDRESS);
      } catch {
        setIsDeployed(false);
      }
    };

    checkTokenDeployment();
  }, [props.address]);

  return (
    <ProfileBoxStyle isIncoming={connection && connection.isIncoming}>
      <ProfileBoxHeaderStyle>
        <ProfileMini address={props.address} isInline isLarge />
        <TrustState connection={connection} />
        <DeployState isDeployed={isDeployed} />
      </ProfileBoxHeaderStyle>

      <ProfileBoxActionsStyle>
        <SendButton address={props.address} isDeployed={isDeployed} />
        <TrustButton address={props.address} connection={connection} />
      </ProfileBoxActionsStyle>

      <ProfileContentStyle>
        <p>{translate('ProfileBox.publicAddress')}</p>
        <InputStyle readOnly value={props.address} />
        <ButtonClipboard isPrimary text={props.address} />
        <RevokeTrustButton connection={connection} />
      </ProfileContentStyle>
    </ProfileBoxStyle>
  );
};

const SendButton = ({ address, isDeployed }) => {
  const safe = useSelector((state) => state.safe);

  // Check against these three cases where we can't send Circles
  //
  // a) We look at our own profile
  // b) Our Safe is not deployed yet
  // c) The profiles Safe is not deployed yet
  const disabled =
    safe.currentAccount === address ||
    safe.pendingNonce !== null ||
    !isDeployed;

  return (
    <ButtonRound disabled={disabled} to={`/send/${address}`}>
      <span>{translate('ProfileBox.sendCircles')}</span>
    </ButtonRound>
  );
};

const TrustButton = ({ connection, address }) => {
  const safe = useSelector((state) => state.safe);

  if (safe.currentAccount === address) {
    return null;
  }

  if (connection && connection.isIncoming) {
    return (
      <ButtonRound disabled isConfirmed>
        <span>{translate('ProfileBox.isTrusted')}</span>
      </ButtonRound>
    );
  }

  return (
    <ButtonRound disabled={safe.nonce !== null} to={`/trust/${address}`}>
      <span>{translate('ProfileBox.trustUser')}</span>
    </ButtonRound>
  );
};

const RevokeTrustButton = ({ connection }) => {
  if (!connection || !connection.isIncoming) {
    return null;
  }

  const safe = useSelector((state) => state.safe);

  if (safe.currentAccount === connection.safeAddress) {
    return null;
  }

  return (
    <ButtonPrimary isOutline to={`/trust/revoke/${connection.safeAddress}`}>
      {translate('ProfileBox.revokeTrustUser')}
    </ButtonPrimary>
  );
};

const TrustState = ({ connection }) => {
  if (!connection || !connection.isOutgoing) {
    return null;
  }

  if (connection.isIncoming) {
    return (
      <TrustStateStyle isMutual>
        {translate('ProfileBox.isMutualTrust')}
      </TrustStateStyle>
    );
  }

  return (
    <TrustStateStyle>{translate('ProfileBox.isTrustingYou')}</TrustStateStyle>
  );
};

const DeployState = ({ isDeployed }) => {
  if (isDeployed) {
    return null;
  }

  return (
    <TrustStateStyle>{translate('ProfileBox.isNotDeployed')}</TrustStateStyle>
  );
};

ProfileBox.propTypes = {
  address: PropTypes.string.isRequired,
};

SendButton.propTypes = {
  address: PropTypes.string.isRequired,
  isDeployed: PropTypes.bool.isRequired,
};

TrustButton.propTypes = {
  address: PropTypes.string.isRequired,
  connection: PropTypes.object,
};

RevokeTrustButton.propTypes = {
  connection: PropTypes.object,
};

TrustState.propTypes = {
  connection: PropTypes.object,
};

DeployState.propTypes = {
  isDeployed: PropTypes.bool.isRequired,
};

const ProfileBoxStyle = styled.div`
  height: ${(props) => {
    return props.isIncoming ? '39rem' : '34rem';
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

  color: ${(props) => {
    return props.isMutual
      ? styles.monochrome.white
      : styles.monochrome.grayDarker;
  }};

  background-color: ${(props) => {
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

  ${ButtonRoundStyle} {
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
