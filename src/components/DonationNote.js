import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Button from '~/components/Button';
import HumbleAlert from '~/components/HumbleAlert';
import translate from '~/services/locale';
import { getItem, hasItem, setItem } from '~/services/storage';

const DONATION_KEY_NAME = 'donationSeen';
const DONATION_URL = 'https://joincircles.net/donate';
const MIN_DAYS = 30;

const useStyles = makeStyles((theme) => ({
  closeButton: {
    marginLeft: theme.spacing(0.5),
    color: theme.palette.grey['600'],
  },
}));

// Show donation again in a few days when it was closed
function isDonationShown() {
  return hasItem(DONATION_KEY_NAME)
    ? DateTime.local()
        .diff(DateTime.fromISO(getItem(DONATION_KEY_NAME)), 'days')
        .toObject().days > MIN_DAYS
    : true;
}

const DonationNote = () => {
  const classes = useStyles();

  const [isOpen, setIsOpen] = useState(isDonationShown());

  const closeDonation = () => {
    setItem(DONATION_KEY_NAME, DateTime.local().toISO());
    setIsOpen(false);
  };

  const handleDonateClick = () => {
    closeDonation();
    window.location = DONATION_URL;
  };

  const handleCloseClick = () => {
    closeDonation();
  };

  return isOpen ? (
    <Box my={2}>
      <HumbleAlert>
        <Typography gutterBottom>
          <strong>{translate('DonationNote.bodyTitle')}</strong>
        </Typography>
        <Typography gutterBottom>
          {translate('DonationNote.bodyPrimary')}
        </Typography>
        <Typography gutterBottom>
          {translate('DonationNote.bodySecondary')}
        </Typography>
        <Box mb={1} mt={2}>
          <Button isPrimary onClick={handleDonateClick}>
            {translate('DonationNote.buttonDonate')}
          </Button>
          <Button className={classes.closeButton} onClick={handleCloseClick}>
            {translate('DonationNote.buttonClose')}
          </Button>
        </Box>
      </HumbleAlert>
    </Box>
  ) : null;
};

export default DonationNote;
