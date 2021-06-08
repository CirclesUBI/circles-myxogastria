import PropTypes from 'prop-types';
import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { Box, Dialog, IconButton, Slide, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Button from '~/components/Button';
import ExternalLink from '~/components/ExternalLink';
import translate from '~/services/locale';
import { IconBack, IconClose } from '~/styles/icons';

import OrgTutorialStep1SVG from '%/images/org-tutorial-step-1.svg';
import OrgTutorialStep2SVG from '%/images/org-tutorial-step-2.svg';
import OrgTutorialStep3SVG from '%/images/org-tutorial-step-3.svg';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    background:
      'linear-gradient(180deg, rgba(215,58,83,1) 0%, rgba(251,134,9,1) 100%)',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    '&::after': {
      [theme.breakpoints.up('sm')]: {
        bottom: 100,
        top: 'auto',
        width: '200%',
        height: '200%',
        transform: 'translate3d(-50%, 0, 0)',
      },
      position: 'absolute',
      display: 'block',
      top: '50%',
      left: '50%',
      width: 500,
      height: 500,
      content: '""',
      backgroundColor: 'white',
      borderRadius: '50%',
      transform: 'translate3d(-50%, -50%, 0)',
    },
  },
  slideContainer: {
    height: '100%',
  },
  slideBody: {
    maxWidth: 480,
    padding: 24,
  },
  footer: {
    margin: '0 auto',
    width: '100%',
    maxWidth: theme.custom.components.appMaxWidth,
  },
}));

const slides = [
  {
    heading: translate('OnboardingOrganizationTutorial.slideHeading1'),
    body: translate('OnboardingOrganizationTutorial.slideBody1'),
    image: <OrgTutorialStep1SVG height="180px" />,
  },
  {
    heading: translate('OnboardingOrganizationTutorial.slideHeading2'),
    body: translate('OnboardingOrganizationTutorial.slideBody2'),
    image: <OrgTutorialStep2SVG height="180px" />,
  },
  {
    heading: translate('OnboardingOrganizationTutorial.slideHeading3'),
    body: translate('OnboardingOrganizationTutorial.slideBody3'),
    image: <OrgTutorialStep3SVG height="180px" />,
  },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LEARN_MORE_URL = 'https://handbook.joincircles.net/docs/communities';

const OnboardingOrganizationTutorial = ({ onFinishTutorial }) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(0);

  const isFirstSlide = step === 0;
  const isLastSlide = step === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      handleFinish();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstSlide) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    setIsOpen(false);
    setTimeout(() => onFinishTutorial(), 300);
  };

  return (
    <Dialog
      TransitionComponent={Transition}
      classes={{ paper: classes.wrapper }}
      fullScreen
      open={isOpen}
    >
      <Box className={classes.background} />
      <Box
        className={classes.slideContainer}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box
          display="flex"
          justifyContent={isFirstSlide ? 'flex-end' : 'space-between'}
          p={2}
        >
          {!isFirstSlide && (
            <IconButton size="small" onClick={handlePrevious}>
              <IconBack />
            </IconButton>
          )}
          <IconButton size="small" onClick={handleFinish}>
            <IconClose />
          </IconButton>
        </Box>
        <Box>
          <SwipeableViews
            index={step}
            onChangeIndex={(index) => setStep(index)}
          >
            {slides.map((slide) => (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                key={slide.heading}
                p={1}
              >
                <Box p={1}>{slide.image}</Box>
                <Typography variant="h6">{slide.heading}</Typography>
                <Typography className={classes.slideBody} variant="body2">
                  {slide.body}
                  <br />{' '}
                  {isLastSlide && (
                    <ExternalLink href={LEARN_MORE_URL} underline="always">
                      {translate(
                        'OnboardingOrganizationTutorial.slideBody3Link',
                      )}
                    </ExternalLink>
                  )}
                </Typography>
              </Box>
            ))}
          </SwipeableViews>
        </Box>
        <Box className={classes.footer} component="footer" p={2}>
          <Button fullWidth isPrimary onClick={handleNext}>
            {isLastSlide
              ? translate('OnboardingOrganizationTutorial.finish')
              : translate('OnboardingOrganizationTutorial.next')}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

OnboardingOrganizationTutorial.propTypes = {
  onFinishTutorial: PropTypes.func.isRequired,
};

export default OnboardingOrganizationTutorial;
