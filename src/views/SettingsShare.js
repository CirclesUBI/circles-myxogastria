import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import BackButton from '~/components/BackButton';
import Header from '~/components/Header';
import ShareTextBox from '~/components/ShareTextBox';
import View from '~/components/View';

import background from '%/images/background-whirly-green.svg';

const SettingsShare = (props, context) => {
  const safe = useSelector(state => state.safe);

  const shareLink = `${process.env.BASE_PATH}/profile/${safe.address}`;

  const shareText = context.t('SettingsShare.shareText', { shareLink });

  return (
    <BackgroundStyle>
      <Header>
        <BackButton isDark to="/settings" />
      </Header>

      <View isFooter isHeader>
        <p>{context.t('SettingsShare.description')}</p>
        <ShareTextBox text={shareText} />
      </View>
    </BackgroundStyle>
  );
};

SettingsShare.contextTypes = {
  t: PropTypes.func.isRequired,
};

const BackgroundStyle = styled.div`
  height: 100%;

  background-image: url(${background});
  background-repeat: no-repeat;
  background-position: top center;
  background-size: cover;
`;

export default SettingsShare;
