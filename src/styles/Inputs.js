import { createGlobalStyle } from 'styled-components';

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
