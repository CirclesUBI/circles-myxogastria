import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import ClipboardButton from '~/components/ClipboardButton';
import ShareButton from '~/components/ShareButton';
import { TextareaStyle } from '~/styles/Inputs';

const SHARE_TITLE = 'Circles';

const ShareTextBox = props => {
  return (
    <ShareTextBoxStyle>
      <ShareTextareaStyle readOnly={true} value={props.text} />

      <ButtonContainerStyle>
        <ShareTextBoxButton {...props} />
      </ButtonContainerStyle>
    </ShareTextBoxStyle>
  );
};

const ShareTextBoxButton = props => {
  // Fallback to ClipboardButton in case native share API does not exist
  if (props.isClipboard || !window.navigator.share) {
    return <ClipboardButton text={props.text} />;
  }

  return <ShareButton text={props.text} title={SHARE_TITLE} url={props.url} />;
};

ShareTextBox.propTypes = {
  isClipboard: PropTypes.bool,
  text: PropTypes.string.isRequired,
  title: PropTypes.string,
  url: PropTypes.string,
};

ShareTextBoxButton.propTypes = {
  isClipboard: PropTypes.bool,
  text: PropTypes.string.isRequired,
  title: PropTypes.string,
  url: PropTypes.string,
};

const ShareTextBoxStyle = styled.div`
  position: relative;

  max-width: 40rem;

  margin: 0 auto;
  margin-top: 3rem;
`;

const ButtonContainerStyle = styled.div`
  position: absolute;

  bottom: -4rem;

  width: 100%;
`;

const ShareTextareaStyle = styled(TextareaStyle)`
  min-height: 20rem;
  max-height: 20rem;
`;

export default ShareTextBox;
