import PropTypes from 'prop-types';
import React from 'react';
import {
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

import Button from '~/components/Button';

const Dialog = ({
  cancelLabel,
  confirmLabel,
  id,
  onClose,
  onConfirm,
  open,
  text,
  title,
}) => {
  return (
    <MuiDialog
      aria-describedby={`dialog-${id}-text`}
      aria-labelledby={`dialog-${id}-description`}
      open={open}
      onClose={onClose}
    >
      <DialogTitle id={`dialog-${id}-title`}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id={`dialog-${id}-description`}>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button isOutline onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button autoFocus isPrimary onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </MuiDialog>
  );
};

Dialog.propTypes = {
  cancelLabel: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Dialog;
