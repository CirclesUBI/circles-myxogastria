import {
  Box,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Dialog as MuiDialog,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

import Button from '~/components/Button';
import ExternalLink from '~/components/ExternalLink';
import translate from '~/services/locale';

const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    display: 'block',
    background: theme.custom.gradients.purple,
    boxShadow: theme.custom.shadows.gray,
    paddingLeft: '30px',
    paddingRight: '30px',

    '& .MuiDialogActions-root': {
      flexDirection: 'column',
    },
  },

  dialogTitle: {
    textAlign: 'center',
    color: theme.custom.colors.white,
    fontSize: '18px',
  },

  dialogText: {
    color: theme.custom.colors.white,
    fontWeight: 500,
    fontSize: '16px',
  },

  removeBackground: {
    '& .MuiPaper-root': {
      backgroundColor: 'transparent',
    },
  },

  dialogActionsContainer: {
    paddingBottom: '19px',

    '& button': {
      marginBottom: '10px',
      width: '100%',
      maxWidth: '250px',
    },

    '& button:last-of-type': {
      marginBottom: 0,
    },
  },

  externalLinkContainer: {
    color: theme.custom.colors.white,
    fontSize: '16px',
    margin: '25px 0 20px',
  },

  externalLinkText: {
    color: theme.custom.colors.white,
    textDecoration: 'underline',
  },

  afterExternalLink: {
    textDecoration: 'none',
  },

  avatarContainer: {
    margin: '0 0 25px',

    '& .MuiAvatar-root': {
      margin: '0 auto',
    },
  },
}));

const Dialog = ({
  avatar,
  cancelLabel,
  confirmLabel,
  externalPath,
  id,
  onClose,
  onConfirm,
  open,
  text,
  title,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.removeBackground}>
      <MuiDialog
        aria-describedby={`dialog-${id}-text`}
        aria-labelledby={`dialog-${id}-description`}
        className={classes.removeBackground}
        open={open}
        onClose={onClose}
      >
        <Box className={classes.dialogContainer}>
          <DialogTitle
            className={classes.dialogTitle}
            id={`dialog-${id}-title`}
          >
            {title}
          </DialogTitle>
          <DialogContent>
            {avatar && <Box className={classes.avatarContainer}>{avatar}</Box>}
            <DialogContentText
              className={classes.dialogText}
              id={`dialog-${id}-description`}
            >
              {text}
            </DialogContentText>
            {externalPath && (
              <Box className={classes.externalLinkContainer}>
                <ExternalLink
                  className={classes.externalLinkText}
                  href={externalPath}
                >
                  {translate('DialogTrust.externalLink')}
                </ExternalLink>
                <span className={classes.afterExternalLink}>
                  {' '}
                  {translate('DialogTrust.afterExternalLink')}
                </span>
              </Box>
            )}
          </DialogContent>
          <DialogActions className={classes.dialogActionsContainer}>
            <Button autoFocus isOutline isWhite onClick={onConfirm}>
              {confirmLabel}
            </Button>
            <Button emptyWhiteText isOutline isWhiteText onClick={onClose}>
              {cancelLabel}
            </Button>
          </DialogActions>
        </Box>
      </MuiDialog>
    </Box>
  );
};

Dialog.propTypes = {
  avatar: PropTypes.elementType,
  cancelLabel: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string.isRequired,
  externalPath: PropTypes.string,
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default React.memo(Dialog);
