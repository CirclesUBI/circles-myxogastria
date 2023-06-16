import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import React from 'react';

import Avatar from '~/components/Avatar';
import QRCode from '~/components/QRCode';
import UsernameDisplay from '~/components/UsernameDisplay';
import { useProfileLink } from '~/hooks/url';
import translate from '~/services/locale';

const useStyles = makeStyles(() => ({
  textContainer: {
    maxWidth: '250px',
    margin: '0 auto',
    marginBottom: '20px',
  },
}));

const ShareBox = ({ address }) => {
  const classes = useStyles();
  const shareLink = useProfileLink(address);

  return (
    <Box>
      <Box className={classes.textContainer}>
        <Typography align="center">
          {translate('ValidationShare.headingShowYourQR')}
        </Typography>
      </Box>
      <QRCode data={shareLink}>
        <Box mb={2}>
          <Avatar address={address} size="medium" />
        </Box>
        <Typography align="center" component="span" variant="h2">
          <UsernameDisplay address={address} />
        </Typography>
      </QRCode>
    </Box>
  );
};

ShareBox.propTypes = {
  address: PropTypes.string.isRequired,
};

export default ShareBox;
