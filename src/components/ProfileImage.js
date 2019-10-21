import PropTypes from 'prop-types';
import React, { useEffect, createRef } from 'react';
import jazzicon from 'jazzicon';
import styled from 'styled-components';

const ICON_SIZE = 30;

const ProfileImage = props => {
  const ref = createRef();

  const generate = () => {
    const identiconElem = jazzicon(ICON_SIZE, props.address);

    ref.current.innerHTML = '';
    ref.current.appendChild(identiconElem);
  };

  useEffect(generate, [props.address]);

  return <ProfileImageStyle ref={ref}></ProfileImageStyle>;
};

ProfileImage.propTypes = {
  address: PropTypes.string.isRequired,
};

const ProfileImageStyle = styled.div`
  display: inline-block;

  overflow: hidden;

  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
`;

export default ProfileImage;
