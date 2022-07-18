import {
  Badge,
  Box,
  Container,
  IconButton,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { DASHBOARD_PATH } from '~/routes';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import ButtonClose from '~/components/ButtonClose';
import CenteredHeading from '~/components/CenteredHeading';
import DialogInfo from '~/components/DialogInfo';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import VerifiedUsernameInput from '~/components/VerifiedUsernameInput';
import View from '~/components/View';
import { useUserdata } from '~/hooks/username';
import translate from '~/services/locale';
import { IconUploadPhoto } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  uploadButton: {
    background: theme.custom.gradients.purple,
    color: theme.palette.common.white,
    padding: 0,
  },
  uploadButtonIcon: {
    position: 'relative',
    left: 1,
    width: '2.2em',
    height: '2.2em',
  },
  textContainer: {
    textAlign: 'center',
    '& >p': {
      marginBottom: '8px',
    },
  },
  dialogContentContainer: {
    [theme.breakpoints.up('md')]: {
      minWidth: '350px',
    },

    '& >p': {
      marginBottom: '30px',
    },
  },
  continueButton: {
    marginBottom: '30px',
  },
}));

const EditProfile = () => {
  const classes = useStyles();
  const [isClose, setIsClose] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOpenDialogCloseInfo, setIsOpenDialogCloseInfo] = useState(false);
  const [isOpenDialogUploadInfo, setIsOpenDialogUploadInfo] = useState(false);
  const [usernameInput, setUsernameInput] = useState(username);

  const safe = useSelector((state) => state.safe);
  const { username } = useUserdata(safe.currentAccount);

  const onCloseBtnHandler = () => {
    setIsOpenDialogCloseInfo(true);
  };

  const onChangeHandler = (username) => {
    setUsernameInput(username);
  };

  const onDisabledChange = (updatedValue) => {
    setIsDisabled(updatedValue);
  };

  const saveChangesHandler = () => {
    console.log('saveChangesHandler');
  };

  const dialogCloseInfoHandler = () => {
    console.log('dialogInfoCloseHandler');
    setIsClose(true);
  };

  const galleryHandler = () => {
    console.log('gallery handler');
  };
  const cameraHandler = () => {
    console.log('camera handler');
  };

  useEffect(() => {
    setUsernameInput(username);
  }, [username]);

  const dialogContentClose = (
    <Box className={classes.dialogContentContainer}>
      <Button
        className={classes.continueButton}
        fullWidth
        isPrimary
        onClick={() => setIsOpenDialogCloseInfo(false)}
      >
        {translate('EditProfile.buttonContinue')}
      </Button>
      <Button fullWidth isOutline isWhite onClick={dialogCloseInfoHandler}>
        {translate('EditProfile.buttonCancel')}
      </Button>
    </Box>
  );

  const dialogContentUpload = (
    <Box className={classes.dialogContentContainer}>
      <Button
        className={classes.continueButton}
        fullWidth
        isOutline
        isWhite
        onClick={galleryHandler}
      >
        {translate('EditProfile.optionFile')}
      </Button>
      <Button fullWidth isOutline isWhite onClick={cameraHandler}>
        {translate('EditProfile.optionCamera')}
      </Button>
    </Box>
  );

  if (isClose) {
    return <Redirect to={DASHBOARD_PATH} />;
  }

  return (
    <>
      <Header>
        <ButtonClose onClick={onCloseBtnHandler}></ButtonClose>
        <CenteredHeading>{translate('EditProfile.heading')}</CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <DialogInfo
            dialogContent={dialogContentClose}
            handleClose={() => setIsOpenDialogCloseInfo(false)}
            id="dialogContentClose"
            isOpen={isOpenDialogCloseInfo}
            title={translate('EditProfile.bodyCancel')}
          />
          <DialogInfo
            dialogContent={dialogContentUpload}
            handleClose={() => setIsOpenDialogUploadInfo(false)}
            id="dialogUpload"
            isOpen={isOpenDialogUploadInfo}
          />
          <Box align="center" mb={2} mt={4}>
            <Badge
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton className={classes.uploadButton}>
                  <IconUploadPhoto className={classes.uploadButtonIcon} />
                </IconButton>
              }
              overlap="circular"
              onClick={() => setIsOpenDialogUploadInfo(true)}
            >
              <Avatar
                address={safe.currentAccount || safe.pendingAddress}
                size="large"
              />
            </Badge>
          </Box>
          <Box>
            <VerifiedUsernameInput
              label={translate('Onboarding.formUsername')}
              value={usernameInput}
              onChange={onChangeHandler}
              onStatusChange={onDisabledChange}
            />
          </Box>
          <Box className={classes.textContainer} mb={3} mt={6}>
            <Typography className="lightGreyText">
              {translate('EditProfile.usernameExplanation')}
            </Typography>
            <Typography className="lightGreyText">
              {translate('EditProfile.charactersExplanation')}
            </Typography>
          </Box>
        </Container>
      </View>
      <Footer>
        <Button
          disabled={isDisabled}
          fullWidth
          isPrimary
          onClick={saveChangesHandler}
        >
          {translate('EditProfile.buttonSave')}
        </Button>
      </Footer>
    </>
  );
};

export default EditProfile;
