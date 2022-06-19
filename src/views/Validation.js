import { Box, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ActivityIcon from '~/components/ActivityIcon';
import AvatarHeader from '~/components/AvatarHeader';
import BackgroundCurved from '~/components/BackgroundCurved';
import Button from '~/components/Button';
import ButtonShare from '~/components/ButtonShare';
import DialogFromBottom from '~/components/DialogFromBottom';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import HumbleAlert from '~/components/HumbleAlert';
import ShareBox from '~/components/ShareBox';
import StepperHorizontal from '~/components/StepperHorizontal';
import ValidationStatus from '~/components/ValidationStatus';
import View from '~/components/View';
import { useUpdateLoop } from '~/hooks/update';
import { useProfileLink } from '~/hooks/url';
import translate from '~/services/locale';
import { finalizeNewAccount } from '~/store/onboarding/actions';
import { checkTrustState } from '~/store/trust/actions';
import { IconBack } from '~/styles/icons';
import { stepperConfiguration } from '~/views/Onboarding';

const useStyles = makeStyles((theme) => ({
  trustConnectionsCircle: {
    backgroundColor: 'transparent',
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },

  validationHeader: {
    '& .MuiToolbar-regular': {
      justifyContent: 'end',
    },
  },

  validationContainer: {
    position: 'relative',
    zIndex: theme.zIndex.layer1,
    textAlign: 'center',
  },

  onboardingMobileStepper: {
    flexGrow: 1,
    paddingTop: 9,
    paddingRight: 19,
    paddingLeft: 19,
    background: 'transparent',

    '& .MuiMobileStepper-progress': {
      display: 'none',
    },
  },

  DialogFromBottomContainer: {
    width: '100%',

    '& .MuiDialog-paper': {
      width: '100%',
      margin: 0,
    },
  },
}));

const Validation = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { trust, safe, token } = useSelector((state) => state);
  const [dialogOpen, setDialogOpen] = useState(false);
  const address = safe.currentAccount || safe.pendingAddress;
  const shareLink = useProfileLink(address);
  const shareText = translate('Share.shareText', { shareLink });

  useUpdateLoop(async () => {
    await dispatch(checkTrustState());
  });

  const isDeploymentReady =
    safe.pendingIsFunded || token.isFunded || trust.isTrusted;

  const stepNames = stepperConfiguration.map((step) => step.stepName);

  const onDeploy = async () => {
    await dispatch(finalizeNewAccount());
  };

  const shareProfileBtnHandler = () => {
    setDialogOpen(true);
  };

  const dialogCloseHandler = () => {
    setDialogOpen(false);
  };

  const dialogContentFooter = () => {
    return (
      <ButtonShare fullWidth isPrimary text={shareText} url={shareLink}>
        {translate('Validation.buttonShareProfileLink')}
      </ButtonShare>
    );
  };

  const dialogContentHeader = () => {
    return <IconBack onClick={dialogCloseHandler} />;
  };

  return (
    <BackgroundCurved gradient="turquoise">
      <Header className={classes.validationHeader}>
        <ActivityIcon />
      </Header>
      <AvatarHeader />
      <DialogFromBottom
        dialogOpen={dialogOpen}
        footer={dialogContentFooter}
        header={dialogContentHeader}
        onCloseHandler={dialogCloseHandler}
      >
        <ShareBox address={address} />
      </DialogFromBottom>
      <View>
        <Container className={classes.validationContainer} maxWidth="sm">
          <StepperHorizontal activeStep={2} steps={stepNames} />
          <Typography align="center" gutterBottom variant="h6">
            {translate('Validation.headingBuildYourWebOfTrust')}
          </Typography>
          <Typography>
            {translate('Validation.bodyTrustDescription')}
          </Typography>
          <Typography>
            {translate('Validation.bodyTrustDescriptionEmphasize')}
          </Typography>
          <ValidationStatus />
        </Container>
      </View>
      <Footer>
        <HumbleAlert>{translate('Validation.bodyDoNotReset')}</HumbleAlert>
        {!isDeploymentReady && (
          <Box mt={2}>
            <Button fullWidth isOutline onClick={shareProfileBtnHandler}>
              {translate('Validation.buttonShareProfileLink')}
            </Button>
          </Box>
        )}
        <Fragment>
          <Box mb={0} mt={2}>
            <Button
              disabled={!isDeploymentReady}
              fullWidth
              isPrimary
              onClick={onDeploy}
            >
              {translate('ValidationStatus.buttonStartDeployment')}
            </Button>
          </Box>
        </Fragment>
      </Footer>
    </BackgroundCurved>
  );
};

export default Validation;
