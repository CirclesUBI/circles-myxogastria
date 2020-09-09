import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';

import ButtonPrimary from '~/components/ButtonPrimary';
import Pill from '~/components/Pill';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import styles from '~/styles/variables';
import { ButtonStyle } from '~/components/Button';
import { SpacingStyle } from '~/styles/Layout';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { removeSafeOwner, getSafeOwners } from '~/store/safe/actions';

const SafeOwnerManager = (props, context) => {
  const safe = useSelector((state) => state.safe);
  const dispatch = useDispatch();

  const isDisabled = safe.nonce !== null;

  useEffect(() => {
    dispatch(getSafeOwners());
  }, []);

  const onRemove = async (address) => {
    dispatch(showSpinnerOverlay());

    try {
      await dispatch(removeSafeOwner(address));
    } catch {
      dispatch(
        notify({
          text: context.t('SafeOwnerManager.errorMessage'),
          type: NotificationsTypes.ERROR,
        }),
      );
    }

    dispatch(hideSpinnerOverlay());
  };

  // Safe is not deployed yet ...
  if (safe.nonce) {
    return <Pill>{context.t('SafeOwnerManager.notDeployedYet')}</Pill>;
  }

  return (
    <Fragment>
      <p>{context.t('SafeOwnerManager.devicesAccessingAccount')}</p>

      <ul>
        <SafeOwnerManagerList owners={safe.owners} onRemove={onRemove} />
      </ul>

      <ButtonPrimary disabled={isDisabled} to="/settings/keys/add">
        {context.t('SafeOwnerManager.addNewDevice')}
      </ButtonPrimary>
    </Fragment>
  );
};

const SafeOwnerManagerList = (props) => {
  if (props.owners.length === 0) {
    return (
      <SpacingStyle>
        <CircularProgress />
      </SpacingStyle>
    );
  }

  return props.owners.map((address) => {
    return (
      <SafeOwnerManagerItem
        address={address}
        key={address}
        onRemove={props.onRemove}
      />
    );
  });
};

const SafeOwnerManagerItem = (props, context) => {
  const wallet = useSelector((state) => state.wallet);

  const onRemove = async () => {
    if (window.confirm(context.t('SafeOwnerManager.areYouSure'))) {
      props.onRemove(props.address);
    }
  };

  if (props.address === wallet.address) {
    return (
      <OwnerStyle isWrap>
        <p>{context.t('SafeOwnerManager.currentDevice')}</p>
        <span>{props.address}</span>
      </OwnerStyle>
    );
  }

  return (
    <OwnerStyle>
      <span>{props.address}</span>
      <ButtonStyle onClick={onRemove}>Remove</ButtonStyle>
    </OwnerStyle>
  );
};

SafeOwnerManagerList.propTypes = {
  onRemove: PropTypes.func.isRequired,
  owners: PropTypes.arrayOf(PropTypes.string).isRequired,
};

SafeOwnerManagerItem.propTypes = {
  address: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
};

SafeOwnerManager.contextTypes = {
  t: PropTypes.func.isRequired,
};

SafeOwnerManagerItem.contextTypes = {
  t: PropTypes.func.isRequired,
};

const OwnerStyle = styled.li`
  display: flex;

  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1.5rem;

  border-radius: 5px;

  background-color: ${styles.monochrome.grayLighter};

  flex-wrap: ${(props) => {
    return props.isWrap ? 'wrap' : 'none';
  }};
  justify-content: space-between;

  p {
    width: 100%;
    max-width: 100%;

    color: ${styles.monochrome.grayDark};

    font-weight: ${styles.base.typography.weightSemiBold};
    font-size: 0.8em;

    text-align: left;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;

    white-space: nowrap;

    font-weight: ${styles.base.typography.weightLight};

    letter-spacing: 2px;
  }
`;

export default SafeOwnerManager;
