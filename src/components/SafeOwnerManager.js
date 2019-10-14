import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Button from '~/components/Button';
import ButtonPrimary from '~/components/ButtonPrimary';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { removeSafeOwner, getSafeOwners } from '~/store/safe/actions';

const SafeOwnerManager = (props, context) => {
  const safe = useSelector(state => state.safe);
  const dispatch = useDispatch();

  const isDisabled = safe.nonce !== null;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getSafeOwners());
  }, []);

  const onRemove = async address => {
    setIsLoading(true);

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

    setIsLoading(false);
  };

  return (
    <Fragment>
      <ul>
        <SafeOwnerManagerList
          isLoading={isLoading}
          owners={safe.owners}
          onRemove={onRemove}
        />
      </ul>

      <ButtonPrimary disabled={isDisabled || isLoading} to="/settings/keys/add">
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
        isLoading={props.isLoading}
        key={address}
        onRemove={props.onRemove}
      />
    );
  });
};

const SafeOwnerManagerItem = (props, context) => {
  const onRemove = async () => {
    props.onRemove(props.address);
  };

  return (
    <li>
      {props.address}{' '}
      <Button disabled={props.isLoading} onClick={onRemove}>
        {context.t('SafeOwnerManager.remove')}
      </Button>
    </li>
  );
};

SafeOwnerManagerList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
  owners: PropTypes.arrayOf(PropTypes.string).isRequired,
};

SafeOwnerManagerItem.propTypes = {
  address: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onRemove: PropTypes.func.isRequired,
};

SafeOwnerManager.contextTypes = {
  t: PropTypes.func.isRequired,
};

SafeOwnerManagerItem.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SafeOwnerManager;
