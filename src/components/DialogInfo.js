import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog as MuiDialog,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import Button from '~/components/Button';

const DialogInfo = ({ dialogContent, handleClose, id, isOpen, title }) => {
  return (
    <MuiDialog
      aria-describedby={`dialog-${id}-text`}
      aria-labelledby={`dialog-${id}-description`}
      open={isOpen}
      onClose={handleClose}
    >
      <DialogTitle id={`dialog-${id}-title`}>{title}</DialogTitle>
      <DialogContent>{dialogContent}</DialogContent>
      <DialogActions>
        <Button align="center" isOutline onClick={handleClose}>
          X
        </Button>
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
