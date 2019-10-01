import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Button from '~/components/Button';
import UsernameDisplay from '~/components/UsernameDisplay';
import { removeSafeOwner, getSafeOwners } from '~/store/safe/actions';

const SafeOwnerManager = (props, context) => {
  const safe = useSelector(state => state.safe);
  const dispatch = useDispatch();

  const isDisabled = safe.nonce !== null;

  useEffect(() => {
    dispatch(getSafeOwners());
  }, []);

  return (
    <Fragment>
      <ul>
        <SafeOwnerManagerList owners={safe.owners} />
      </ul>

      <Link to="/settings/keys/add">
        <Button disabled={isDisabled}>
          {context.t('views.settings.addOwner')}
        </Button>
      </Link>
    </Fragment>
  );
};

const SafeOwnerManagerList = props => {
  return props.owners.map(owner => {
    return <SafeOwnerManagerItem address={owner.address} key={owner.address} />;
  });
};

const SafeOwnerManagerItem = (props, context) => {
  const dispatch = useDispatch();

  const onRemove = () => {
    dispatch(removeSafeOwner(props.address));
  };

  return (
    <li>
      <UsernameDisplay address={props.address} />

      <button onClick={onRemove}>
        {context.t('views.settings.removeOwner')}
      </button>
    </li>
  );
};

SafeOwnerManagerList.propTypes = {
  owners: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string,
    }),
  ).isRequired,
};

SafeOwnerManagerItem.propTypes = {
  address: PropTypes.string.isRequired,
};

SafeOwnerManager.contextTypes = {
  t: PropTypes.func.isRequired,
};

SafeOwnerManagerItem.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default SafeOwnerManager;
