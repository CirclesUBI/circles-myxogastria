import { createGlobalStyle } from 'styled-components';

import styles from '~/styles/variables';

export default createGlobalStyle`
  textarea {
    display: block;

    min-width: 100%;
    max-width: 100%;
    min-height: 20rem;

    padding: ${styles.layout.spacing};
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
    padding: ${styles.layout.spacing};

    appearance: none;

    border: 0;
    border-radius: 0;

    color: ${styles.inputs.color};

    background-color: ${styles.inputs.colorBackground};

    font-weight: ${styles.typography.weight};
    font-family: ${styles.typography.family};

    &:focus {
      outline: 0;
    }

    &[disabled] {
      color: ${styles.inputs.colorDisabled};

      cursor: default;
    }
  }
`;
