import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import ProfileImage from '~/components/ProfileImage';
import UsernameDisplay from '~/components/UsernameDisplay';
import styles from '~/styles/variables';

const MiniProfile = props => {
  return (
    <MiniProfileStyle isInline={props.isInline}>
      <ProfileImage address={props.address} />

      <UsernameDisplayStyle isLarge={props.isLarge}>
        <UsernameDisplay address={props.address} />
      </UsernameDisplayStyle>
    </MiniProfileStyle>
  );
};

MiniProfile.propTypes = {
  address: PropTypes.string.isRequired,
  isInline: PropTypes.bool,
  isLarge: PropTypes.bool,
};

const MiniProfileStyle = styled.div`
  display: inline-flex;

  padding: 1rem;

  border-radius: 5px;

  background-color: ${styles.monochrome.white};

  box-shadow: ${props => {
    return props.isInline ? '0' : `1px 1px 4px ${styles.monochrome.grayDark}`;
  }};

  align-items: center;

  cursor: pointer;
`;

const UsernameDisplayStyle = styled.span`
  padding-left: 1rem;

  font-size: ${props => {
    return props.isLarge ? '1.5em' : '1em';
  }};
`;

export default MiniProfile;
