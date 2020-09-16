import PropTypes from 'prop-types';
import React from 'react';
import { Box, Typography } from '@material-ui/core';

import Avatar from '~/components/Avatar';
import QRCode from '~/components/QRCode';
import UsernameDisplay from '~/components/UsernameDisplay';
import { useProfileLink } from '~/hooks/url';

const ShareBox = ({ address }) => {
  const shareLink = useProfileLink(address);

  return (
    <Box mb={2} mt={4}>
      <QRCode data={shareLink}>
        <Box mb={2}>
          <Avatar address={address} size={100} />
        </Box>
        <Typography align="center" component="span" variant="h6">
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
