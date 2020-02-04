import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';

import ButtonBack from '~/components/ButtonBack';
import ButtonHome from '~/components/ButtonHome';
import ButtonPrimary from '~/components/ButtonPrimary';
import Footer from '~/components/Footer';
import Header, { HeaderCenterStyle } from '~/components/Header';
import TutorialSteps from '~/components/TutorialSteps';
import View from '~/components/View';

const Tutorial = props => {
  const [current, setCurrent] = useState(0);
  const total = props.slides.length;

  const onExit = () => {
    props.onExit();
  };

  const onPrevious = () => {
    setCurrent(current - 1);
  };

  const onNext = () => {
    setCurrent(current + 1);
  };

  const onFinish = () => {
    props.onFinish();
  };

  return (
    <Fragment>
      <TutorialHeader
        current={current}
        total={total}
        onExit={onExit}
        onPrevious={onPrevious}
      />

      <View isFooter isHeader>
        {props.slides[current]}
      </View>

      <TutorialFooter
        current={current}
        total={total}
        onFinish={onFinish}
        onNext={onNext}
      />
    </Fragment>
  );
};

const TutorialHeader = props => {
  return (
    <Header>
      <TutorialHeaderButton
        isFirstSlide={props.current === 0}
        onExit={props.onExit}
        onPrevious={props.onPrevious}
      />

      <HeaderCenterStyle>
        <TutorialSteps current={props.current} total={props.total} />
      </HeaderCenterStyle>
    </Header>
  );
};

const TutorialHeaderButton = props => {
  if (props.isFirstSlide) {
    return <ButtonHome isDark onClick={props.onExit} />;
  }

  return <ButtonBack isDark onClick={props.onPrevious} />;
};

const TutorialFooter = props => {
  return (
    <Footer>
      <TutorialFooterButton
        isLastSlide={props.current === props.total - 1}
        onFinish={props.onFinish}
        onNext={props.onNext}
      />
    </Footer>
  );
};

const TutorialFooterButton = (props, context) => {
  if (props.isLastSlide) {
    return (
      <ButtonPrimary onClick={props.onFinish}>
        {context.t('Tutorial.finish')}
      </ButtonPrimary>
    );
  }

  return (
    <ButtonPrimary onClick={props.onNext}>
      {context.t('Tutorial.nextStep')}
    </ButtonPrimary>
  );
};

Tutorial.propTypes = {
  onExit: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  slides: PropTypes.array.isRequired,
};

TutorialHeader.propTypes = {
  current: PropTypes.number.isRequired,
  onExit: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

TutorialHeaderButton.propTypes = {
  isFirstSlide: PropTypes.bool.isRequired,
  onExit: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
};

TutorialFooter.propTypes = {
  current: PropTypes.number.isRequired,
  onFinish: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

TutorialFooterButton.propTypes = {
  isLastSlide: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

TutorialFooterButton.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Tutorial;
