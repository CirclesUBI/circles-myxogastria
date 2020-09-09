import styled from 'styled-components';

import styles from '~/styles/variables';

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
  max-width: 42rem;

  border-radius: 5px;

  font-weight: ${styles.base.typography.weightLight};

  box-shadow: inset 1px 2px 2px ${styles.monochrome.gray};
`;

export const InputNumberStyle = styled.input`
  max-width: 11rem;

  margin: 2rem auto;
  padding: 0;
  padding-right: 0.5rem;
  padding-left: 0.5rem;

  border: 0;
  border-bottom: 1px solid ${styles.monochrome.black};

  background: transparent;

  font-weight: ${styles.base.typography.weightLight};
  font-size: 2.5em;
`;

export const LabelStyle = styled.label`
  display: block;

  color: ${styles.monochrome.grayDark};

  font-weight: ${styles.base.typography.weightSemiBold};
  font-size: 0.8em;
`;

export const FieldsetStyle = styled.fieldset`
  max-width: 42rem;

  margin: 0 auto;

  border: 0;

  text-align: left;
`;
