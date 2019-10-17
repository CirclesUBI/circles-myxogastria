import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import ButtonPrimary from '~/components/ButtonPrimary';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import styles from '~/styles/variables';
import { ButtonStyle } from '~/components/Button';
import { IconExit } from '~/styles/Icons';
import { hideSpinnerOverlay, showSpinnerOverlay } from '~/store/app/actions';
import { removeSafeOwner, getSafeOwners } from '~/store/safe/actions';

const SafeOwnerManager = (props, context) => {
  const safe = useSelector(state => state.safe);
  const dispatch = useDispatch();

  const isDisabled = safe.nonce !== null;

  useEffect(() => {
    dispatch(getSafeOwners());
  }, []);

  const onRemove = async address => {
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
    return null;
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

const SafeOwnerManagerList = props => {
  return props.owners.map(address => {
    return (
      <SafeOwnerManagerItem
        address={address}
        key={address}
        onRemove={props.onRemove}
      />
    );
  });
};

const SafeOwnerManagerItem = props => {
  const onRemove = async () => {
    props.onRemove(props.address);
  };

  return (
    <OwnerStyle>
      <span>{props.address}</span>

      <ButtonStyle onClick={onRemove}>
        <IconExit isDark />
      </ButtonStyle>
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

  justify-content: space-between;

  span {
    overflow: hidden;
    text-overflow: ellipsis;

    white-space: nowrap;

    font-weight: ${styles.base.typography.weightLight};

    letter-spacing: 2px;
  }

  ${IconExit} {
    &::before {
      color: ${styles.monochrome.grayDark};
    }
  }
`;

export default SafeOwnerManager;
