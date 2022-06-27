import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog as MuiDialog,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import ButtonClose from '~/components/ButtonClose';

const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    '& .MuiDialog-paper': {
      borderRadius: '10px',
      boxShadow: theme.custom.shadows.gray,
      textAlign: 'center',
    },
    '& .MuiBackdrop-root': {
      background: theme.custom.colors.dialogGray,
    },
    '& .MuiDialogTitle-root': {
      paddingTop: '40px',
    },
  },
}));

const DialogInfo = ({ dialogContent, handleClose, id, isOpen, title }) => {
  const classes = useStyles();

  return (
    <MuiDialog
      aria-describedby={`dialog-${id}-text`}
      aria-labelledby={`dialog-${id}-description`}
      className={classes.dialogContainer}
      open={isOpen}
      onClose={handleClose}
    >
      <DialogTitle id={`dialog-${id}-title`}>{title}</DialogTitle>
      <DialogContent>{dialogContent}</DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <ButtonClose onClick={handleClose} />
      </DialogActions>
    </MuiDialog>
  );
};

DialogInfo.propTypes = {
  dialogContent: PropTypes.element,
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default React.memo(DialogInfo);
