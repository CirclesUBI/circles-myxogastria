import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

import DialogContentUpload from '~/components/DialogContentUpload';
import DialogInfo from '~/components/DialogInfo';

const useStyles = makeStyles(() => ({
  dialogContentContainer: {
    '& >p': {
      marginBottom: '30px',
    },
  },
}));

const DialogAvatarUpload = ({
  avatarUploadUrl,
  isOpen,
  handleClose,
  handleUpload,
  setAvatarUploadUrl,
}) => {
  const classes = useStyles();

  return (
    <DialogInfo
      className={classes.dialogUploadContainer}
      dialogContent={
        <DialogContentUpload
          avatarUploadUrl={avatarUploadUrl}
          handleClose={handleClose}
          handleUpload={handleUpload}
          setNewAvatarUrl={setAvatarUploadUrl}
        />
      }
      fullWidth
      handleClose={handleClose}
      isOpen={isOpen}
      maxWidth={'xs'}
    />
  );
};

DialogAvatarUpload.propTypes = {
  avatarUploadUrl: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  handleUpload: PropTypes.func,
  isOpen: PropTypes.bool,
  setAvatarUploadUrl: PropTypes.func.isRequired,
};

export default DialogAvatarUpload;
