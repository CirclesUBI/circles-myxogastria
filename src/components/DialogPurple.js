import { Box, Dialog, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
    paddingLeft: '45px',
    paddingRight: '45px',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },

  root: {
    '&:hover': {
      background: 'transparent',
    },
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
        {title}
      </DialogTitle>
      {children}
      <Box pb={2} pt={2}>
        {!!onConfirm && (
          <Box display="flex" flexDirection="column" pb={1}>
            <Button isWhite m={2} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </Box>
        )}
        <Box display="flex" flexDirection="column">
          <Button className={classes.root} isWhiteText m={2} onClick={onClose}>
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
