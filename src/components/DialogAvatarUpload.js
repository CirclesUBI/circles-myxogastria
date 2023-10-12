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

const DialogAvatarUpload = ({ isOpen, handleClose, setProfilePicUrl }) => {
  const classes = useStyles();

  const onFileUploadHandler = (updatedValue) => {
    setProfilePicUrl(updatedValue);
  };

  const uploadImgSrcHandler = (updatedValue) => {
    setProfilePicUrl(updatedValue);
  };

  return (
    <DialogInfo
      className={classes.dialogUploadContainer}
      dialogContent={
        <DialogContentUpload
          handleClose={handleClose}
          uploadImgSrc={uploadImgSrcHandler}
          onFileUpload={onFileUploadHandler}
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
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  setProfilePicUrl: PropTypes.func.isRequired,
};

export default DialogAvatarUpload;
