import { Box, Container, Dialog } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

import Footer from '~/components/Footer';

const useStyles = makeStyles(() => ({
  DialogFromBottomContainer: {
    width: '100%',

    '& .MuiDialog-container': {
      alignItems: 'end',
    },

    '& .MuiDialog-paper': {
      width: '100%',
      margin: 0,
      height: '88%',
      maxHeight: '700px',
      borderTopLeftRadius: '30px',
      borderTopRightRadius: '30px',
      borderBottomRightRadius: '0px',
    },
  },

  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '15px 0 0',
  },
}));

const DialogFromBottom = ({
  dialogOpen,
  onCloseHandler,
  children,
  header,
  footer,
}) => {
  const classes = useStyles();
  const FooterElement = footer;
  const HeaderElement = header;

  return (
    <Dialog
      aria-describedby="alert-dialog-slide-description"
      className={classes.DialogFromBottomContainer}
      open={dialogOpen}
      onClose={onCloseHandler}
    >
      <Box className={classes.headerContainer}>
        <Container>
          <HeaderElement>{header}</HeaderElement>
        </Container>
      </Box>
      <Container>{children}</Container>
      <Footer>
        <FooterElement />
      </Footer>
    </Dialog>
  );
};

DialogFromBottom.propTypes = {
  children: PropTypes.node,
  dialogOpen: PropTypes.bool,
  footer: PropTypes.func,
  header: PropTypes.func,
  onCloseHandler: PropTypes.func,
};

export default DialogFromBottom;
