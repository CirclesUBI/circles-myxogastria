import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { DASHBOARD_PATH, EDIT_PROFILE_PATH } from '~/routes';

import Button from '~/components/Button';
import DialogInfo from '~/components/DialogInfo';
import ExternalLink from '~/components/ExternalLink';
import { useUserdata } from '~/hooks/username';
import core from '~/services/core';
import translate from '~/services/locale';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import { FAQ_URL_DELETION } from '~/utils/constants';
import logError from '~/utils/debug';

const useStyles = makeStyles(() => ({
  textContainer: {
    maxWidth: '250px',
    margin: '0 auto',
    marginBottom: '40px',
  },
}));

const ButtonDeleteProfile = ({ displayEditOption, isOutline, isText }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [useCacheOnRedirect, setUseCacheOnRedirect] = useState(true);
  const [isOpenDialogCloseInfo, setIsOpenDialogCloseInfo] = useState(false);
  const [isProfileDeleted, setIsProfileDeleted] = useState(false);

  const safe = useSelector((state) => state.safe);
  const { avatarUrl } = useUserdata(safe.currentAccount);

  async function deleteUserProfile() {
    setIsOpenDialogCloseInfo(false);
    try {
      const result = await core.user.delete(safe.currentAccount);
      await core.avatar.delete(avatarUrl);

      if (result) {
        setUseCacheOnRedirect(false);
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
      }

      setIsProfileDeleted(true);
    } catch (error) {
      logError(error);
      dispatch(
        notify({
          text: (
            <Typography classes={{ root: 'body4_white' }} variant="body4">
              {translate('ButtonDeleteProfile.notificationError')}
            </Typography>
          ),
          type: NotificationsTypes.ERROR,
        }),
      );
    }
  }

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
      <ExternalLink href={FAQ_URL_DELETION}>
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
        {displayEditOption && (
          <Box display="flex" flexDirection="column" pb={1}>
            <Button fullWidth isOutline to={EDIT_PROFILE_PATH}>
              {translate('ButtonDeleteProfile.linkEditProfile')}
            </Button>
          </Box>
        )}
        <Box display="flex" flexDirection="column">
          <Button
            className={classes.continueButton}
            fullWidth
            onClick={deleteUserProfile}
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

  if (isProfileDeleted) {
    return (
      <Redirect
        to={{
          pathname: DASHBOARD_PATH,
          state: { useCache: useCacheOnRedirect },
        }}
      />
    );
  }

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
      <Button
        fullWidth
        isOutline={isOutline}
        isText={isText}
        onClick={dialogOpenInfoHandler}
      >
        {translate('ButtonDeleteProfile.btnText')}
      </Button>
    </Box>
  );
};

ButtonDeleteProfile.propTypes = {
  displayEditOption: PropTypes.bool,
  isOutline: PropTypes.bool,
  isText: PropTypes.bool,
};

export default ButtonDeleteProfile;
