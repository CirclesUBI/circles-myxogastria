import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import ClipboardButton from '~/components/ClipboardButton';
import styles from '~/styles/variables';

const ShareTextBox = props => {
  return (
    <ShareTextBoxStyle>
      <TextareaStyle readOnly={true} value={props.text} />

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

const TextareaStyle = styled.textarea`
  min-height: 20rem;
  max-height: 20rem;

  border-radius: 5px;

  font-weight: ${styles.base.typography.weightLight};

  line-height: 1.5;

  box-shadow: inset 1px 5px 5px ${styles.monochrome.gray};
`;

export default ShareTextBox;
