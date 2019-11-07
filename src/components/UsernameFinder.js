import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import MiniProfile from '~/components/MiniProfile';
import web3 from '~/services/web3';
import { InputStyle } from '~/styles/Inputs';
import { SpacingStyle } from '~/styles/Layout';

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

      return;
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
      <InputStyle
        placeholder={context.t('UsernameFinder.inputPlaceholder')}
        type="text"
        value={props.input}
        onChange={onInputChange}
      />

      <SpacingStyle>
        <ListStyle>
          <UsernameFinderResult
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
