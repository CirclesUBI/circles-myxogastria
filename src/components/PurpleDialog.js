import PropTypes from 'prop-types';
import React from 'react';
import { Box, Dialog, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CrcButton from '~/components/Button';

const useStyles = makeStyles((theme) => ({
  paper: {
    background: 'linear-gradient(284.04deg, #660F33 0%, #CC1E66 100%)',
    borderRadius: 0,
    borderBottomRightRadius: 48,
    maxWidth: 720,
    minWidth: 280,
    minHeight: 240,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
}));

const useTitleStyles = makeStyles((theme) => ({
  root: {
    color: theme.custom.colors.grayLightest,
  },
}));

const PurpleDialog = ({ title, children, ...otherProps }) => {
  const classes = useStyles();
  const titleClasses = useTitleStyles();
  return (
    <Dialog classes={classes} {...otherProps} maxWidth="lg">
      <DialogTitle align="center" classes={titleClasses}>
        {title}
      </DialogTitle>

      {children}
      <Box display="flex" flexDirection="column" pt={2} pb={1}>
        <CrcButton isWhite m={2}>
          Trust
        </CrcButton>
      </Box>
      <Box display="flex" flexDirection="column" pb={2}>
        <CrcButton isWhiteText m={2}>
          Cancel
        </CrcButton>
      </Box>
    </Dialog>
  );
};

PurpleDialog.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

export default PurpleDialog;
