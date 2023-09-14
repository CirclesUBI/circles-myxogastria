import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog as MuiDialog,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

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
      <DialogTitle id={`dialog-${id}-title`}>
        <Typography variant="h4">{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id={`dialog-${id}-description`}>
          <Typography variant="body4">{text}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button isOutline onClick={onClose}>
          {cancelLabel}
        </Button>
      </DialogActions>
    </MuiDialog>
  );
};

Dialog.propTypes = {
  cancelLabel: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default React.memo(Dialog);
