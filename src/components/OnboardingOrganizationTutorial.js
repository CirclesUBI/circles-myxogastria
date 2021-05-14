import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import { Box, Typography } from '@material-ui/core';
import OrgTutorialStep1SVG from '%/images/org-tutorial-step-1.svg';
import OrgTutorialStep2SVG from '%/images/org-tutorial-step-2.svg';
import OrgTutorialStep3SVG from '%/images/org-tutorial-step-3.svg';

const useStyles = makeStyles(() => ({
  dialogWrapper: {
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(180deg, rgba(215,58,83,1) 0%, rgba(251,134,9,1) 100%)',
  },
  slideContainer: {
    position: 'absolute',
    width: '130vw',
    height: '130vw',
    top: 'calc(50vh - 65vw)',
    left: '-15vw',
    padding: '12px 20vw',
    margin: 'auto',
    maxWidth: 480,
    maxHeight: 480,
    borderRadius: '50%',
    background: 'white',
    display: 'flex',
    justifyContent: 'center',
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
      <div className={classes.slideContainer}>
        <SwipeableViews index={step} onChangeIndex={(index) => setStep(index)}>
          {slides.map((step) => (
            <div key={step.heading}>
              <Box
                alignItems="center"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                width={300}
              >
                {step.image}
                <Typography variant="h6">{step.heading}</Typography>
                <Typography variant="body2">{step.body}</Typography>
              </Box>
            </div>
          ))}
        </SwipeableViews>
      </div>
    </Dialog>
  );
};

export default OnboardingOrganizationTutorial;
