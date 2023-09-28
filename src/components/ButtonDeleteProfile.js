import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from '~/components/Button';
import DialogInfo from '~/components/DialogInfo';
import ExternalLink from '~/components/ExternalLink';
import translate from '~/services/locale';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { FAQ_URL } from '~/utils/constants';
import logError from '~/utils/debug';

const useStyles = makeStyles(() => ({
  textContainer: {
    maxWidth: '250px',
    margin: '0 auto',
    marginBottom: '40px',
  },
}));

const ButtonDeleteProfile = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [isOpenDialogCloseInfo, setIsOpenDialogCloseInfo] = useState(false);

  const dialogCloseInfoHandler = () => {
    setIsOpenDialogCloseInfo(false);
    try {
      // TODO add delete logic

      dispatch(
        notify({
          text: (
            <Typography classes={{ root: 'body4_white' }} variant="body4">
              {translate('ButtonDeleteProfile.notificationSuccess')}
            </Typography>
          ),
          type: NotificationsTypes.SUCCESS,
        }),
      );
    } catch (error) {
      logError(error);
      dispatch(
        notify({
          text: (
            <Typography classes={{ root: 'body4_white' }} variant="body4">
              {translate('ButtonDeleteProfile.notification.Error')}
            </Typography>
          ),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  };

  const dialogOpenInfoHandler = () => {
    setIsOpenDialogCloseInfo(true);
  };

  const dialogContentClose = (
    <Box className={classes.dialogContentContainer}>
      <Typography align="center" mb={2}>
        {translate('ButtonDeleteProfile.bodyText')}
      </Typography>
      <Typography align="center" mb={2}>
        {translate('ButtonDeleteProfile.bodyText2')}
      </Typography>
      <Typography align="center" mb={2}>
        {translate('ButtonDeleteProfile.bodyText3')}
      </Typography>
      <Typography align="center" mb={2}>
        {translate('ButtonDeleteProfile.bodyText4')}
      </Typography>
      <ExternalLink href={FAQ_URL}>
        <Typography
          align="center"
          classes={{ root: 'body3_link_gradient' }}
          paragraph
          variant="body3"
        >
          {translate('ButtonDeleteProfile.readMore')}
        </Typography>
      </ExternalLink>
      <Box pt={3}>
        <Box display="flex" flexDirection="column" pb={1}>
          <Button
            className={classes.continueButton}
            fullWidth
            onClick={dialogCloseInfoHandler}
          >
            {translate('ButtonDeleteProfile.confirmationDelete')}
          </Button>
        </Box>
        <Box display="flex" flexDirection="column">
          <Button isText m={2} onClick={() => setIsOpenDialogCloseInfo(false)}>
            {translate('ButtonDeleteProfile.confirmationCancel')}
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box>
      <DialogInfo
        dialogContent={dialogContentClose}
        fullWidth
        handleClose={() => setIsOpenDialogCloseInfo(false)}
        isBtnClose={false}
        isOpen={isOpenDialogCloseInfo}
        maxWidth={'xs'}
        title={translate('ButtonDeleteProfile.titleText')}
      />
      <Button fullWidth isOutline onClick={dialogOpenInfoHandler}>
        {translate('ButtonDeleteProfile.btnText')}
      </Button>
    </Box>
  );
};

export default ButtonDeleteProfile;
