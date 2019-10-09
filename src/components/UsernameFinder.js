import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import UsernameDisplay from '~/components/UsernameDisplay';
import web3 from '~/services/web3';

const MAX_SEARCH_RESULTS = 5;

const UsernameFinder = (props, context) => {
  const [isQueryEmpty, setIsQueryEmpty] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  const trust = useSelector(state => state.trust);

  const onInputChange = event => {
    props.onInputChange(event.target.value);
  };

  const onSelect = user => {
    props.onSelect(user);
  };

  const search = () => {
    setIsQueryEmpty(props.input.length === 0);

    if (props.input.length === 0) {
      setSearchResults([]);
      return;
    }

    if (web3.utils.isAddress(props.input)) {
      props.onSelect({
        safeAddress: props.input,
      });
    }

    const result = trust.network
      .filter(connection => {
        return connection.username.includes(props.input);
      })
      .sort((itemA, itemB) => {
        return itemA.username.lowercaseCompareTo(itemB.username);
      })
      .slice(0, MAX_SEARCH_RESULTS);

    setSearchResults(result);
  };

  useEffect(search, [props.input]);

  return (
    <Fragment>
      <input
        placeholder={context.t('UsernameFinder.inputPlaceholder')}
        type="text"
        value={props.input}
        onChange={onInputChange}
      />

      <UsernameFinderResult
        isQueryEmpty={isQueryEmpty}
        items={searchResults}
        onClick={onSelect}
      />
    </Fragment>
  );
};

const UsernameFinderResult = (props, context) => {
  const onClick = user => {
    props.onClick(user);
  };

  if (!props.isQueryEmpty && props.items.length === 0) {
    return <p>{context.t('UsernameFinder.noResultsGiven')}</p>;
  }

  return props.items.map((item, index) => {
    return <UsernameFinderItem key={index} user={item} onClick={onClick} />;
  });
};

const UsernameFinderItem = props => {
  const onClick = () => {
    props.onClick(props.user);
  };

  return (
    <li onClick={onClick}>
      <UsernameDisplay address={props.user.safeAddress} />
    </li>
  );
};

UsernameFinder.propTypes = {
  input: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

UsernameFinderResult.propTypes = {
  onClick: PropTypes.func.isRequired,
};

UsernameFinderItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

UsernameFinder.contextTypes = {
  t: PropTypes.func.isRequired,
};

UsernameFinderResult.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default UsernameFinder;
