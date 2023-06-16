import { Box, Drawer, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import { useState } from 'react';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Line from '%/images/line.svg';
import Button from '~/components/Button';
import DateInput from '~/components/DateInput';
import { useUserdata } from '~/hooks/username';
import translate from '~/services/locale';
import notify, { NotificationsTypes } from '~/store/notifications/actions';
import logError, { translateErrorForUser } from '~/utils/debug';
import { downloadCsvStatement } from '~/utils/fileExports';

const MAX_EXPORT_HISTORY = 365;
const MAX_EXPORT_LENGTH = 365;

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    top: theme.custom.components.appBarHeight,
    padding: '36px 0',
    borderTopLeftRadius: '36px',
    borderTopRightRadius: '36px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  drawerContentContainer: {
    maxWidth: '372px',
    margin: '0 auto',
    padding: '0 10px',

    [theme.breakpoints.up('md')]: {
      padding: '0 36px',
      maxWidth: '424px',
    },
  },
  dateInputsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: '15px',
  },
  btnContainer: {
    marginTop: 'auto',
  },
  loadingTextContainer: {
    textAlign: 'center',
    marginBottom: '10px',
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
  helperDate: {
    margin: '29px 0 0',
  },
}));

const DialogExportStatement = ({ dialogOpen, onCloseHandler }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const now = DateTime.now();
  const defaultEnd = now.set({ day: 1 }).minus({ days: 1 });
  const defaultStart = defaultEnd.set({ day: 1 });
  const earliestDate = now.minus({ days: MAX_EXPORT_HISTORY });

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [errorFromInput, setErrorFromInput] = useState(null);
  const [errorToInput, setErrorToInput] = useState(null);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date > endDate || endDate === null) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleExport =
    (username, safeAddress, startDate, endDate) => async () => {
      const startMidnight = startDate.set({ hour: 0, minute: 0, second: 0 });
      const endMidnight = endDate.set({ hour: 23, minute: 59, second: 59 });
      setIsDownloading(true);
      try {
        await downloadCsvStatement(
          username,
          safeAddress,
          startMidnight,
          endMidnight,
        );

        dispatch(
          notify({
            text: (
              <Typography
                classes={{ root: 'body4_white' }}
                dangerouslySetInnerHTML={{
                  __html: translate('ExportStatement.exportSuccessful'),
                }}
                variant="body4"
              />
            ),
            type: NotificationsTypes.SUCCESS,
          }),
        );
      } catch (error) {
        logError(error);
        dispatch(
          notify({
            text: (
              <Typography classes={{ root: 'body4_white' }} variant="body4">
                {translateErrorForUser(error)}
              </Typography>
            ),
            type: NotificationsTypes.ERROR,
          }),
        );
      }
      setIsDownloading(false);
    };

  const { safeAddress } = useSelector((state) => {
    return {
      safeAddress: state.safe.currentAccount,
    };
  });
  let { username } = useUserdata(safeAddress);

  useEffect(() => {
    const isInvalidDate =
      startDate > endDate ||
      startDate.invalid !== null ||
      endDate.invalid !== null ||
      errorFromInput !== null ||
      errorToInput !== null;

    setIsInvalid(isInvalidDate);
  }, [startDate, endDate, errorFromInput, errorToInput]);

  const errorMessageTo = useMemo(() => {
    switch (errorToInput) {
      case 'maxDate':
      case 'minDate': {
        return translate('ExportStatement.exportHintRange');
      }
      case 'invalidDate': {
        return translate('ExportStatement.exportHintDate');
      }
      default: {
        return '';
      }
    }
  }, [errorToInput]);

  const errorMessageFrom = useMemo(() => {
    switch (errorFromInput) {
      case 'maxDate':
      case 'minDate': {
        return translate('ExportStatement.exportHintRange');
      }
      case 'invalidDate': {
        return translate('ExportStatement.exportHintDate');
      }
      default: {
        return '';
      }
    }
  }, [errorFromInput]);

  return (
    <Drawer
      anchor="bottom"
      classes={{
        paper: classes.drawerPaper,
      }}
      open={dialogOpen}
      onClose={onCloseHandler}
    >
      <Box className={classes.drawerContentContainer}>
        <Typography variant="h2">
          {translate('ExportStatement.exportWallet')}
        </Typography>
        <Typography variant="h3">@{username}</Typography>
        <Typography classes={{ root: 'body6_monochrome' }} variant="body6">
          {safeAddress}
        </Typography>
        <Line className={classes.lineGrey} />
        <Box className={classes.dateContainer}>
          <Typography sx={{ mb: '11px' }} variant="h2">
            {translate('ExportStatement.exportTimeSpan')}
          </Typography>
          <Box className={classes.dateInputsContainer}>
            <DatePicker
              format="dd/MM/yyyy"
              label={translate('ExportStatement.exportFrom')}
              maxDate={now}
              minDate={earliestDate}
              slotProps={{
                textField: { helperText: errorMessageFrom },
              }}
              slots={{
                textField: DateInput,
              }}
              value={startDate}
              onChange={handleStartDateChange}
              onError={(newError) => setErrorFromInput(newError)}
            />
            <DatePicker
              format="dd/MM/yyyy"
              label={translate('ExportStatement.exportTo')}
              maxDate={DateTime.min(
                now,
                startDate.plus({ days: MAX_EXPORT_LENGTH }),
              )}
              minDate={startDate}
              slotProps={{
                textField: { helperText: errorMessageTo },
              }}
              slots={{
                textField: DateInput,
              }}
              value={endDate}
              onChange={handleEndDateChange}
              onError={(newError) => setErrorToInput(newError)}
            />
          </Box>
        </Box>
        <Box className={classes.helperDate}>
          <Typography>{translate('ExportStatement.exportHelper')}</Typography>
        </Box>
        <Line className={classes.lineLightGrey} />
        <Typography variant="h2">
          {translate('ExportStatement.exportFormat')}
        </Typography>
        <Typography>{translate('ExportStatement.exportInfoText')}</Typography>
      </Box>
      <Box className={classes.btnContainer}>
        {isDownloading && (
          <Box className={classes.loadingTextContainer}>
            <Typography classes={{ root: 'body6_monochrome' }} variant="body6">
              {translate('ExportStatement.exportLoadingText')}
            </Typography>
          </Box>
        )}
        <Button
          classes={{ root: classes.btn }}
          disabled={isInvalid || isDownloading}
          onClick={handleExport(username, safeAddress, startDate, endDate)}
        >
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
