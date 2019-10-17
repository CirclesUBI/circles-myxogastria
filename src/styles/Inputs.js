import styled, { createGlobalStyle } from 'styled-components';

import styles from '~/styles/variables';

const { layout, inputs } = styles.base;

export default createGlobalStyle`
  textarea {
    display: block;

    min-width: 100%;
    max-width: 100%;
    min-height: 20rem;

    padding: ${layout.spacing};
  }

  select {
    cursor: pointer;
  }

  input[type="date"],
  input[type="email"],
  input[type="number"],
  input[type="password"],
  input[type="search"],
  input[type="text"],
  input[type="time"],
  input[type="url"],
  input:not([type]),
  textarea,
  select {
    padding: ${layout.spacing};

    appearance: none;

    border: 0;
    border-radius: 0;

    color: ${inputs.color};

    background-color: ${inputs.colorBackground};

    font-weight: ${inputs.weight};
    font-family: ${inputs.family};

    &:focus {
      outline: 0;
    }

    &[disabled] {
      color: ${inputs.colorDisabled};

      cursor: default;
    }
  }
`;

export const TextareaStyle = styled.textarea`
  min-height: 20rem;
  max-height: 20rem;

  border-radius: 5px;

  font-weight: ${styles.base.typography.weightLight};

  line-height: 1.5;

  box-shadow: inset 1px 5px 5px ${styles.monochrome.gray};
`;

export const InputStyle = styled.input`
  width: 100%;
  max-width: 40rem;

  border-radius: 5px;

  font-weight: ${styles.base.typography.weightLight};

  box-shadow: inset 1px 2px 2px ${styles.monochrome.gray};
`;

export const LabelStyle = styled.label`
  display: block;

  color: ${styles.monochrome.grayDark};

  font-weight: ${styles.base.typography.weightSemiBold};
  font-size: 0.8em;
`;

export const FieldsetStyle = styled.fieldset`
  max-width: 40rem;

  margin: 0 auto;

  border: 0;

  text-align: left;
`;
