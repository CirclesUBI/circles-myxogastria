import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import MiniProfile from '~/components/MiniProfile';

const TrustNetwork = () => {
  const { network } = useSelector(state => state.trust);

  return (
    <ListStyle>
      <TrustNetworkList connections={network} />
    </ListStyle>
  );
};

const TrustNetworkList = props => {
  return props.connections.map(connection => {
    return (
      <TrustNetworkListItem
        connection={connection}
        key={connection.safeAddress}
      />
    );
  });
};

const TrustNetworkListItem = ({ connection }) => {
  const { safeAddress } = connection;

  return (
    <ListItemStyle>
      <LinkStyle to={`/profile/${safeAddress}`}>
        <MiniProfile address={safeAddress} isInline />
      </LinkStyle>
    </ListItemStyle>
  );
};

TrustNetworkList.propTypes = {
  connections: PropTypes.array.isRequired,
};

TrustNetworkListItem.propTypes = {
  connection: PropTypes.object.isRequired,
};

const ListStyle = styled.ul`
  width: 30rem;

  margin: 0 auto;
  margin-top: 2rem;

  list-style: none;
`;

const ListItemStyle = styled.li`
  margin-top: 0;
  margin-bottom: 0;

  text-align: left;
`;

const LinkStyle = styled(Link)`
  display: inline-flex;

  transition: opacity linear 0.2s;

  align-items: center;

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export default TrustNetwork;
