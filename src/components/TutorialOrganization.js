import { Box, Dialog, IconButton, Slide, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';

import OrgTutorialStep1SVG from '%/images/org-tutorial-step-1.svg';
import OrgTutorialStep2SVG from '%/images/org-tutorial-step-2.svg';
import OrgTutorialStep3SVG from '%/images/org-tutorial-step-3.svg';
import Button from '~/components/Button';
import ExternalLink from '~/components/ExternalLink';
import translate from '~/services/locale';
import { IconBack, IconClose } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: theme.custom.gradients.violetTutorial,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    '&::after': {
      position: 'absolute',
      display: 'block',
      left: '50%',
      width: 750,
      height: 750,
      content: '""',
      backgroundColor: 'white',
      borderRadius: '50%',
      top: 'auto',
      bottom: '100px',
      transform: 'translate3d(-50%, 0, 0)',

      [theme.breakpoints.up('sm')]: {
        top: 'auto',
        width: '200%',
        bottom: 100,
        height: '200%',
        transform: 'translate3d(-50%, 0, 0)',
      },
    },
  },
  slideContainer: {
    height: '100%',
  },
  imageContainer: {
    height: 280,
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
    heading: translate('TutorialOrganization.slideHeading1'),
    body: translate('TutorialOrganization.slideBody1'),
    image: OrgTutorialStep1SVG,
  },
  {
    heading: translate('TutorialOrganization.slideHeading2'),
    body: translate('TutorialOrganization.slideBody2'),
    image: OrgTutorialStep2SVG,
  },
  {
    heading: translate('TutorialOrganization.slideHeading3'),
    body: translate('TutorialOrganization.slideBody3'),
    image: OrgTutorialStep3SVG,
  },
];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LEARN_MORE_URL = 'https://handbook.joincircles.net/docs/communities';

const TutorialOrganization = ({ onFinishTutorial }) => {
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
          padding={1}
        >
          {!isFirstSlide && (
            <IconButton size="large" onClick={handlePrevious}>
              <IconBack />
            </IconButton>
          )}
          <IconButton size="large" onClick={handleFinish}>
            <IconClose />
          </IconButton>
        </Box>
        <Box>
          <SwipeableViews
            index={step}
            onChangeIndex={(index) => setStep(index)}
          >
            {slides.map((slide, slideIndex) => (
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                key={slide.heading}
                p={1}
              >
                <TutorialOrganizationImage image={slide.image} />
                <Typography variant="h2">{slide.heading}</Typography>
                <Typography className={classes.slideBody} variant="body1">
                  {slide.body}
                  <br />{' '}
                  {slideIndex === slides.length - 1 && (
                    <ExternalLink href={LEARN_MORE_URL}>
                      <Typography
                        classes={{ root: 'body3_link_gradient' }}
                        variant="body3"
                      >
                        {translate('TutorialOrganization.slideBody3Link')}
                      </Typography>
                    </ExternalLink>
                  )}
                </Typography>
              </Box>
            ))}
          </SwipeableViews>
        </Box>
        <Box className={classes.footer} component="footer" p={2}>
          <Button fullWidth isOutline onClick={handleNext}>
            {isLastSlide
              ? translate('TutorialOrganization.finish')
              : translate('TutorialOrganization.next')}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

const TutorialOrganizationImage = ({ image }) => {
  const classes = useStyles();

  const ImageComponent = image;

  return (
    <Box alignItems="center" className={classes.imageContainer} display="flex">
      <ImageComponent />
    </Box>
  );
};

TutorialOrganization.propTypes = {
  onFinishTutorial: PropTypes.func.isRequired,
};

TutorialOrganizationImage.propTypes = {
  image: PropTypes.func.isRequired,
};

export default TutorialOrganization;
