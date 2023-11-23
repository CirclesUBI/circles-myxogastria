import {
  Box,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog as MuiDialog,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

import Button from '~/components/Button';

const useStyles = makeStyles((theme) => ({
  paper: {
    borderRadius: 0,
    borderBottomRightRadius: 48,
    maxWidth: 720,
    minWidth: 280,
    minHeight: 240,
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
}));

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
  const classes = useStyles();

  return (
    <MuiDialog
      aria-describedby={`dialog-${id}-text`}
      aria-labelledby={`dialog-${id}-description`}
      classes={classes}
      open={open}
      onClose={onClose}
    >
      <DialogTitle align="center" id={`dialog-${id}-title`}>
        <Typography component="span" variant="h4">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText align="center" id={`dialog-${id}-description`}>
          <Typography variant="body4">{text}</Typography>
        </DialogContentText>
      </DialogContent>
      <Box pb={2} pt={2}>
        <Box display="flex" flexDirection="column" pb={1}>
          <Button autoFocus fullWidth onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </Box>
        <Box display="flex" flexDirection="column">
          <Button fullWidth isOutline onClick={onClose}>
            {cancelLabel}
          </Button>
        </Box>
      </Box>
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
