import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import ClipboardButton from '~/components/ClipboardButton';
import MiniProfile from '~/components/MiniProfile';
import RoundButton from '~/components/RoundButton';
import styles from '~/styles/variables';
import { BackgroundGreenBottom } from '~/styles/Background';
import { IconSend } from '~/styles/Icons';
import { InputStyle } from '~/styles/Inputs';

const ProfileBox = (props, context) => {
  const sendLink = `/send/${props.address}`;

  // @TODO: Display trust state and give untrust / trust options
  return (
    <ProfileBoxStyle>
      <MiniProfile address={props.address} isInline isLarge />

      <RoundButton to={sendLink}>
        <IconSend />
        <span>{context.t('ProfileBox.sendCircles')}</span>
      </RoundButton>

      <ProfileContentStyle>
        <p>{context.t('ProfileBox.publicAddress')}</p>
        <InputStyle readOnly value={props.address} />
        <ClipboardButton isPrimary text={props.address} />
      </ProfileContentStyle>
    </ProfileBoxStyle>
  );
};

ProfileBox.contextTypes = {
  t: PropTypes.func.isRequired,
};

ProfileBox.propTypes = {
  address: PropTypes.string.isRequired,
};

const ProfileBoxStyle = styled(BackgroundGreenBottom)`
  height: 33rem;

  padding: 1rem;

  border-radius: 5px;

  background-color: ${styles.monochrome.white};

  text-align: left;

  box-shadow: 0 0 10px ${styles.monochrome.grayDarker};
`;

const ProfileContentStyle = styled.div`
  max-width: 40rem;

  margin: 0 auto;
  margin-top: 2rem;

  text-align: center;
`;

export default ProfileBox;
