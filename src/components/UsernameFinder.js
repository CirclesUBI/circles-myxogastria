import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import MiniProfile from '~/components/MiniProfile';
import Spinner from '~/components/Spinner';
import core from '~/services/core';
import debounce from '~/utils/debounce';
import web3 from '~/services/web3';
import { InputStyle } from '~/styles/Inputs';
import { SpacingStyle } from '~/styles/Layout';

const MAX_SEARCH_RESULTS = 5;

const UsernameFinder = (props, context) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isQueryEmpty, setIsQueryEmpty] = useState(true);
  const [searchResults, setSearchResults] = useState([]);

  const safe = useSelector(state => state.safe);

  const onInputChange = event => {
    props.onInputChange(event.target.value);
  };

  const onSelect = user => {
    props.onSelect(user);
  };

  const debouncedSearch = useCallback(
    debounce(async query => {
      // Search the database for similar usernames
      const response = await core.user.search(query);

      const result = response.data
        .filter(item => {
          return item.safeAddress !== safe.address;
        })
        .sort((itemA, itemB) => {
          return itemA.username
            .toLowerCase()
            .localeCompare(itemB.username.toLowerCase());
        })
        .slice(0, MAX_SEARCH_RESULTS);

      setSearchResults(result);
      setIsLoading(false);
    }),
    [],
  );

  useEffect(() => {
    const query = props.input;

    setIsQueryEmpty(query.length === 0);

    if (query.length === 0) {
      setSearchResults([]);
      return;
    }

    // Shortcut for putting in a valid address directly
    if (web3.utils.isAddress(query)) {
      props.onSelect({
        safeAddress: query,
      });

      return;
    }

    setIsLoading(true);
    debouncedSearch(query);
  }, [props.input]);

  return (
    <Fragment>
      <InputStyle
        placeholder={context.t('UsernameFinder.inputPlaceholder')}
        type="text"
        value={props.input}
        onChange={onInputChange}
      />

      <SpacingStyle>
        <ListStyle>
          <UsernameFinderResult
            isLoading={isLoading}
            isQueryEmpty={isQueryEmpty}
            items={searchResults}
            onClick={onSelect}
          />
        </ListStyle>
      </SpacingStyle>
    </Fragment>
  );
};

const UsernameFinderResult = (props, context) => {
  const onClick = user => {
    props.onClick(user);
  };

  if (!props.isQueryEmpty && props.items.length === 0 && !props.isLoading) {
    return <p>{context.t('UsernameFinder.noResultsGiven')}</p>;
  }

  if (props.isLoading) {
    return <Spinner />;
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
    <ItemStyle onClick={onClick}>
      <MiniProfile address={props.user.safeAddress} />
    </ItemStyle>
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

const ListStyle = styled.ul`
  list-style: none;
`;

const ItemStyle = styled.li`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export default UsernameFinder;
