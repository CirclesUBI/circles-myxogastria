import { Box, Drawer, TextField, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PropTypes from 'prop-types';
import { useState } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';

import Line from '%/images/line.svg';
import Button from '~/components/Button';
import { useUserdata } from '~/hooks/username';
import translate from '~/services/locale';

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    top: theme.custom.components.appBarHeight,
    padding: '36px',
    borderTopLeftRadius: '36px',
    borderTopRightRadius: '36px',
    maxWidth: '424px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  btnContainer: {
    marginTop: 'auto',
  },
  btn: {
    display: 'block',
    paddingLeft: '20px',
    paddingRight: '20px',
    margin: '0 auto',
  },
  lineGrey: {
    margin: '16px 0 42px',
  },
  lineLightGrey: {
    stroke: theme.custom.colors.lily,
    margin: '29px 0 42px',
  },
}));

const DialogExportStatement = ({ dialogOpen, onCloseHandler }) => {
  const classes = useStyles();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date > endDate || endDate === null) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const { safeAddress } = useSelector((state) => {
    return {
      safeAddress: state.safe.currentAccount,
    };
  });
  let { username } = useUserdata(safeAddress);

  return (
    <Drawer
      anchor="bottom"
      classes={{
        paper: classes.drawerPaper,
      }}
      open={dialogOpen}
      onClose={onCloseHandler}
    >
      <Typography variant="bodyTitle">
        {translate('ExportStatement.exportWallet')}
      </Typography>
      <Typography
        sx={{ lineHeight: '140%', fontWeight: '400' }}
        variant="bodyTitle"
      >
        @{username}
      </Typography>
      <Typography variant="bodySmall">{safeAddress}</Typography>
      <Line className={classes.lineGrey} />
      <Box className={classes.dateContainer}>
        <Typography variant="bodyTitle">
          {translate('ExportStatement.exportTimeSpan')}
        </Typography>
        <Box>
          <DatePicker
            label={translate('ExportStatement.exportFrom')}
            renderInput={(params) => <TextField {...params} />}
            sx={{ marginRight: '25px', marginBottom: '10px' }}
            value={startDate}
            onChange={handleStartDateChange}
          />
          <DatePicker
            label={translate('ExportStatement.exportTo')}
            minDate={startDate}
            renderInput={(params) => <TextField {...params} />}
            value={endDate}
            onChange={handleEndDateChange}
          />
        </Box>
      </Box>
      <Line className={classes.lineLightGrey} />
      <Typography variant="bodyTitle">
        {translate('ExportStatement.exportFormat')}
      </Typography>
      <Typography variant="bodyText">
        {translate('ExportStatement.exportInfoText')}
      </Typography>
      <Box className={classes.btnContainer}>
        <Button classes={{ root: classes.btn }}>
          {translate('ExportStatement.exportBtnText')}
        </Button>
      </Box>
    </Drawer>
  );
};

DialogExportStatement.propTypes = {
  dialogOpen: PropTypes.bool,
  onCloseHandler: PropTypes.func,
};

export default DialogExportStatement;
