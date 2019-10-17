import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import ClipboardButton from '~/components/ClipboardButton';
import { TextareaStyle } from '~/styles/Inputs';

const ShareTextBox = props => {
  return (
    <ShareTextBoxStyle>
      <ShareTextareaStyle readOnly={true} value={props.text} />

      <ButtonContainerStyle>
        <ClipboardButton text={props.text} />
      </ButtonContainerStyle>
    </ShareTextBoxStyle>
  );
};

ShareTextBox.propTypes = {
  text: PropTypes.string.isRequired,
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
