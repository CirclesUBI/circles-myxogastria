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
const MAX_EXPORT_LENGTH = 92;

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
  const dispatch = useDispatch();

  const now = DateTime.now();
  const defaultEnd = now.set({ day: 1 }).minus({ days: 1 });
  const defaultStart = defaultEnd.set({ day: 1 });
  const earliestDate = now.minus({ days: MAX_EXPORT_HISTORY });

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [errorFromInput, setErrorFromInput] = useState(null);
  const [errorToInput, setErrorToInput] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

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
              <span
                dangerouslySetInnerHTML={{
                  __html: translate('ExportStatement.exportSuccessfull'),
                }}
              />
            ),
            type: NotificationsTypes.SUCCESS,
          }),
        );
      } catch (error) {
        logError(error);
        dispatch(
          notify({
            text: translateErrorForUser(error),
            type: NotificationsTypes.ERROR,
          }),
        );
      }
    };

  const { safeAddress } = useSelector((state) => {
    return {
      safeAddress: state.safe.currentAccount,
    };
  });
  let { username } = useUserdata(safeAddress);

  useEffect(() => {
    if (
      startDate > endDate ||
      startDate.invalid !== null ||
      endDate.invalid !== null ||
      errorFromInput !== null ||
      errorToInput !== null
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [startDate, endDate, errorFromInput, errorToInput]);

  const errorMessageTo = useMemo(() => {
    switch (errorToInput) {
      case 'maxDate':
      case 'minDate': {
        return 'Select a correct date range';
      }
      case 'invalidDate': {
        return 'Your date is not valid';
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
        return 'Select a correct date range';
      }
      case 'invalidDate': {
        return 'Your date is not valid';
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
          <Box className={classes.dateInputsContainer}>
            <DatePicker
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
        <Line className={classes.lineLightGrey} />
        <Typography variant="bodyTitle">
          {translate('ExportStatement.exportFormat')}
        </Typography>
        <Typography variant="bodyText">
          {translate('ExportStatement.exportInfoText')}
        </Typography>
      </Box>
      <Box className={classes.btnContainer}>
        <Button
          classes={{ root: classes.btn }}
          disabled={isDisabled}
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
