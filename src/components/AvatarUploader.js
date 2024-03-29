import { Box, CircularProgress } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Avatar from '~/components/Avatar';
import DialogAvatarUpload from '~/components/DialogAvatarUpload';
import { IconPlus } from '~/styles/icons';

const useStyles = makeStyles((theme) => ({
  avatarUpload: {
    backgroundColor: theme.custom.colors.white,
    border: `1px solid ${theme.palette.secondary.main}`,
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

const AvatarUploader = ({
  handleUpload,
  onLoadingChange,
  showIndicatorRing,
  presetUrl,
}) => {
  const classes = useStyles();

  const [isOpenDialogUploadInfo, setIsOpenDialogUploadInfo] = useState(false);
  const [avatarUploadUrl, setAvatarUploadUrl] = useState(presetUrl);
  const isLoading = useSelector((state) => state.isLoading);

  useEffect(() => {
    onLoadingChange(isLoading);
  }, [isLoading, onLoadingChange]);

  return (
    <Fragment>
      <DialogAvatarUpload
        avatarUploadUrl={avatarUploadUrl}
        handleClose={() => setIsOpenDialogUploadInfo(false)}
        handleUpload={handleUpload}
        isOpen={isOpenDialogUploadInfo}
        setAvatarUploadUrl={setAvatarUploadUrl}
      />
      <Box
        className={classes.avatarUploaderContainer}
        onClick={() => setIsOpenDialogUploadInfo(true)}
      >
        <Avatar
          className={classes.avatarUpload}
          showIndicatorRing={showIndicatorRing}
          size="medium"
          url={avatarUploadUrl}
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
  handleUpload: PropTypes.func,
  onLoadingChange: PropTypes.func.isRequired,
  presetUrl: PropTypes.string,
  showIndicatorRing: PropTypes.bool,
};

export default AvatarUploader;
