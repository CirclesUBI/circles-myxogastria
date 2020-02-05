import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';

const TutorialSteps = props => {
  return (
    <TutorialStepsStyle>
      <TutorialStepsItems current={props.current} total={props.total} />
    </TutorialStepsStyle>
  );
};

const TutorialStepsItems = props => {
  return new Array(props.total).fill(0).map((item, index) => {
    return (
      <TutorialStepsItemStyle isCurrent={props.current === index} key={index} />
    );
  });
};

TutorialSteps.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

TutorialStepsItems.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

const TutorialStepsStyle = styled.ul`
  display: flex;
`;

const TutorialStepsItemStyle = styled.li`
  width: 1rem;
  height: 1rem;

  margin: 0.5rem;

  border-radius: 50%;

  background-color: ${props => {
    return props.isCurrent
      ? styles.monochrome.black
      : styles.monochrome.grayLight;
  }};
`;

export default TutorialSteps;
