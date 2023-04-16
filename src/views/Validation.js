import { Box, Container, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AppNote from '~/components/AppNote';
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
import { useIsOrganization } from '~/hooks/username';
import translate from '~/services/locale';
import { finalizeNewAccount } from '~/store/onboarding/actions';
import { checkTrustState } from '~/store/trust/actions';
import { IconBack } from '~/styles/icons';
import { colors } from '~/styles/theme';
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
  const { isOrganization } = useIsOrganization(address);
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
      <ButtonShare fullWidth text={shareText} url={shareLink}>
        {translate('Validation.buttonShareProfileLink')}
      </ButtonShare>
    );
  };

  const dialogContentHeader = () => {
    return <IconBack onClick={dialogCloseHandler} />;
  };

  return (
    <BackgroundCurved gradient="turquoise">
      <Header
        className={classes.validationHeader}
        hasWhiteIcons
        useSpecialWithColorOnScroll
      />
      <AvatarHeader useCache={false} />
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
          <StepperHorizontal
            activeStep={2}
            isOrganization={isOrganization}
            steps={stepNames}
          />
          <Typography align="center" gutterBottom variant="h2">
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
        <AppNote messageVersion="validation" />
        <HumbleAlert
          color={colors.blue100}
          icon="IconBrowser"
          iconColor={colors.whiteAlmost}
        >
          <Typography classes={{ root: 'body4_white' }} variant="body4">
            {translate('Validation.bodyDoNotReset')}
          </Typography>
        </HumbleAlert>
        {!isDeploymentReady && (
          <Box mt={2}>
            <Button fullWidth isOutline onClick={shareProfileBtnHandler}>
              {translate('Validation.buttonShareProfileLink')}
            </Button>
          </Box>
        )}
        <Fragment>
          <Box mb={0} mt={2}>
            <Button disabled={!isDeploymentReady} fullWidth onClick={onDeploy}>
              {translate('ValidationStatus.buttonStartDeployment')}
            </Button>
          </Box>
        </Fragment>
      </Footer>
    </BackgroundCurved>
  );
};

export default Validation;
