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

const DialogAvatarUpload = ({ isOpen, handleClose, setAvatarUploadUrl }) => {
  const classes = useStyles();

  const setNewAvatarUrl = (updatedValue) => {
    setAvatarUploadUrl(updatedValue);
  };

  return (
    <DialogInfo
      className={classes.dialogUploadContainer}
      dialogContent={
        <DialogContentUpload
          handleClose={handleClose}
          setNewAvatarUrl={setNewAvatarUrl}
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
  setAvatarUploadUrl: PropTypes.func.isRequired,
};

export default DialogAvatarUpload;
