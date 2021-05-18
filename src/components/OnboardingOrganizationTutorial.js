import React, { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import { Box, Typography } from '@material-ui/core';
import OrgTutorialStep1SVG from '%/images/org-tutorial-step-1.svg';
import OrgTutorialStep2SVG from '%/images/org-tutorial-step-2.svg';
import OrgTutorialStep3SVG from '%/images/org-tutorial-step-3.svg';

const CutCircleSVG = () => {
  return (
    <svg
      height="100%"
      version="1.1"
      viewBox="0 0 845 988"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        fill="none"
        fillRule="evenodd"
        id="Page-1"
        stroke="none"
        strokeWidth="1"
      >
        <path
          d="M845,238.697556 L845,749.302444 C758.466603,892.36878 601.401235,988 422,988 C243.287681,988 86.740017,893.101835 -1.84741111e-13,750.948499 L0,237.051501 C86.740017,94.898165 243.287681,0 422,0 C601.401235,0 758.466603,95.6312197 845.000006,238.697563 Z"
          fill="#FFFFFF"
          id="Combined-Shape"
        ></path>
      </g>
    </svg>
  );
};

const svgStringCutCircle = encodeURIComponent(
  renderToStaticMarkup(<CutCircleSVG />),
);
const dataUriCutCircle = `url("data:image/svg+xml,${svgStringCutCircle}")`;

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(180deg, rgba(215,58,83,1) 0%, rgba(251,134,9,1) 100%)',
  },
  slideContainer: {
    background: dataUriCutCircle,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: '70vh',
    padding: 12,
  },
  slideBody: {
    padding: 24,
  },
}));

const slides = [
  {
    heading: 'Share Wallet',
    body:
      'With a Shared Wallet you can pull your individual circles together and organize joint projects with the people that you trust. This wallet will not receive a basic income.',
    image: <OrgTutorialStep1SVG height="200px" />,
  },
  {
    heading: 'Share Wealth',
    body:
      'Organizations, families, communties, and individuals can use these wallets to hold Circles in common, or keep track of a personal business.',
    image: <OrgTutorialStep2SVG height="200px" />,
  },
  {
    heading: 'Share Trust',
    body: 'As a group you can trust other groups.',
    image: <OrgTutorialStep3SVG height="200px" />,
  },
];

const OnboardingOrganizationTutorial = () => {
  const classes = useStyles();
  const [step, setStep] = useState(1);
  // props.onExit();
  // dispatch(finishTutorial(ACCOUNT_CREATE));

  return (
    <Dialog
      className={classes.dialogWrapper}
      fullScreen
      open
      // cancelLabel={translate('DialogTrust.dialogTrustCancel')}
      // confirmLabel={translate('DialogTrust.dialogTrustConfirm')}
      // id="trust"
      // open={isOpen}
      // text={translate('DialogTrust.dialogTrustDescription', { username })}
      // title={translate('DialogTrust.dialogTrustTitle', { username })}
      // onClose={handleTrustClose}
      // onConfirm={handleTrust}
    >
      <Box className={classes.wrapper}>
        <SwipeableViews index={step} onChangeIndex={(index) => setStep(index)}>
          {slides.map((step) => (
            <Box
              alignItems="center"
              className={classes.slideContainer}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              key={step.heading}
            >
              {step.image}
              <Typography variant="h6">{step.heading}</Typography>
              <Typography className={classes.slideBody} variant="body2">
                {step.body}
              </Typography>
            </Box>
          ))}
        </SwipeableViews>
      </Box>
    </Dialog>
  );
};

export default OnboardingOrganizationTutorial;
