import { Box, CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import GroupWalletCircleSVG from '%/images/organization-indicator.svg';
import Avatar from '~/components/Avatar';
import DialogAvatarUpload from '~/components/DialogAvatarUpload';
import { IconPlus } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  avatarUpload: {
    backgroundColor: theme.custom.colors.white,
    border: `1px solid ${theme.palette.secondary.main}`,
  },
  indicatorContainer: {
    position: 'absolute',
    top: '-2px',
    left: 0,
  },
  avatarUploaderContainer: {
    display: 'inline-flex',
    position: 'relative',
    flexShrink: 0,
    verticalAlign: 'middle',
  },
  plusIcon: {
    fontSize: '16px',
    zIndex: theme.zIndex.layer2,
  },
}));

const AvatarUploader = ({ onLoadingChange, shouldHaveIndicator }) => {
  const classes = useStyles();

  const [isOpenDialogUploadInfo, setIsOpenDialogUploadInfo] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const isLoading = useSelector((state) => state.isLoading);

  useEffect(() => {
    onLoadingChange(isLoading);
  }, [isLoading, onLoadingChange]);

  return (
    <Fragment>
      <DialogAvatarUpload
        handleClose={() => setIsOpenDialogUploadInfo(false)}
        isOpen={isOpenDialogUploadInfo}
        setProfilePicUrl={setProfilePicUrl}
      />
      <Box
        className={classes.avatarUploaderContainer}
        onClick={() => setIsOpenDialogUploadInfo(true)}
      >
        {shouldHaveIndicator && (
          <Box className={classes.indicatorContainer}>
            <GroupWalletCircleSVG width={94} />
          </Box>
        )}
        <Avatar
          className={classes.avatarUpload}
          size="medium"
          url={profilePicUrl}
          withClickEffect={isOpenDialogUploadInfo}
          withHoverEffect
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <IconPlus className={classes.plusIcon} />
          )}
        </Avatar>
      </Box>
    </Fragment>
  );
};

AvatarUploader.propTypes = {
  onLoadingChange: PropTypes.func.isRequired,
  shouldHaveIndicator: PropTypes.bool,
};

export default AvatarUploader;
