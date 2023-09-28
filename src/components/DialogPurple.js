import { Box, Dialog, DialogTitle, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

import Button from '~/components/Button';

const useStyles = makeStyles((theme) => ({
  paper: {
    background: 'linear-gradient(284.04deg, #660F33 0%, #CC1E66 100%)',
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

const useTitleStyles = makeStyles((theme) => ({
  root: {
    color: theme.custom.colors.grayLightest,
  },
}));

const DialogPurple = ({
  children,
  cancelLabel,
  confirmLabel,
  onClose,
  onConfirm,
  title,
  ...otherProps
}) => {
  const classes = useStyles();
  const titleClasses = useTitleStyles();

  return (
    <Dialog classes={classes} onClose={onClose} {...otherProps} maxWidth="lg">
      <DialogTitle align="center" classes={titleClasses}>
        <Typography
          classes={{ root: 'h4_link_white' }}
          component="span"
          variant="h4"
        >
          {title}
        </Typography>
      </DialogTitle>
      {children}
      <Box pb={2} pt={2}>
        {!!onConfirm && (
          <Box display="flex" flexDirection="column" pb={1}>
            <Button isOutline m={2} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </Box>
        )}
        <Box display="flex" flexDirection="column">
          <Button isWhiteText m={2} onClick={onClose}>
            {cancelLabel}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

DialogPurple.propTypes = {
  cancelLabel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  confirmLabel: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  title: PropTypes.string.isRequired,
};

export default DialogPurple;
