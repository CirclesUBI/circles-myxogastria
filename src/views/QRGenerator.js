import React, { Fragment, useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  Card,
  CardHeader,
  Container,
  FormHelperText,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import ButtonShare from '~/components/ButtonShare';
import ButtonBack from '~/components/ButtonBack';
import CenteredHeading from '~/components/CenteredHeading';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import QRCode from '~/components/QRCode';
import View from '~/components/View';
import translate from '~/services/locale';
import { IconCircles } from '~/styles/icons';
import { useSendLink } from '~/hooks/url';
import { useUserdata } from '~/hooks/username';
import { validatePaymentNote, validateAmount } from '~/services/token';

const QR_CODE_WIDTH = 1024;
const QR_CODE_SCALE = 2;

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: theme.spacing(1),
  },
  inputLabel: {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: 12,
  },
  totalBalance: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: 12,
    '&>*': {
      marginRight: theme.spacing(0.5),
    },
  },
  inputAmount: {
    fontSize: 27,
  },
  inputAmountError: {
    color: theme.custom.colors.red,
  },
  paper: {
    minHeight: 66,
  },
  dialogPaymentNote: {
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.grey['900'],
    wordWrap: 'break-word',
  },
}));

const QRGenerator = () => {
  const classes = useStyles();

  const [amount, setAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const safe = useSelector((state) => state.safe);
  const { username } = useUserdata(safe.currentAccount);

  const handleAmountChange = (event) => {
    const newAmount = event.target.value;
    if (newAmount && !validateAmount(newAmount)) {
      return;
    }
    setAmount(newAmount);
  };

  const isPaymentNoteInvalid =
    paymentNote.length > 0 && !validatePaymentNote(paymentNote);

  const handlePaymentNoteChange = (event) => {
    setPaymentNote(event.target.value);
  };

  const data = useSendLink(safe.currentAccount, amount, paymentNote);

  const handleShowQR = () => {
    setIsOpen(true);
  };

  const handleHideQR = () => {
    setIsOpen(false);
  };

  const handleSaveFile = () => {
    document.getElementById('qr').toBlob((blob) => {
      saveAs(blob, 'qr.png');
    });
  };

  return (
    <Fragment>
      <QRCode
        data={data}
        id="qr"
        scale={QR_CODE_SCALE}
        style={{ display: 'none' }}
        width={QR_CODE_WIDTH}
      />
      <Dialog
        aria-describedby={`dialog-qr-text`}
        aria-labelledby={`dialog-qr-description`}
        open={isOpen}
        onClose={handleHideQR}
      >
        <DialogContent>
          <QRCode data={data} />
          <Box mb={2} mt={2}>
            <Button fullWidth isOutline onClick={handleSaveFile}>
              {translate('QRGenerator.dialogSaveFile')}
            </Button>
          </Box>
          <Box mb={2}>
            <ButtonShare fullWidth isOutline text={paymentNote} url={data}>
              {translate('QRGenerator.dialogShare')}
            </ButtonShare>
          </Box>
          <Box mb={1} mt={2}>
            <Button autoFocus fullWidth isPrimary onClick={handleHideQR}>
              {translate('QRGenerator.dialogClose')}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Header>
        <ButtonBack />
        <CenteredHeading>
          {translate('QRGenerator.headingGenerator')}
        </CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <InputLabel className={classes.inputLabel} htmlFor="receiver">
                {translate('QRGenerator.formReceiver')}
              </InputLabel>
              <Card>
                <CardHeader
                  avatar={<Avatar address={safe.currentAccount} size="tiny" />}
                  classes={{
                    root: classes.cardHeader,
                  }}
                  title={`@${username}`}
                />
              </Card>
            </Grid>
            <Grid item xs={12}>
              <InputLabel className={classes.inputLabel} htmlFor="amount">
                {translate('QRGenerator.formAmount')}
              </InputLabel>
              <Paper className={classes.paper}>
                <Box p={2}>
                  <Input
                    autoFocus
                    classes={{
                      input: classes.inputAmount,
                      error: classes.inputAmountError,
                    }}
                    disableUnderline
                    fullWidth
                    id="amount"
                    inputProps={{
                      min: 0,
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <IconCircles />
                      </InputAdornment>
                    }
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <InputLabel className={classes.inputLabel} htmlFor="payment-note">
                {translate('QRGenerator.formPaymentNote')}
              </InputLabel>
              <Paper className={classes.paper}>
                <Box p={2}>
                  <Input
                    disableUnderline
                    error={isPaymentNoteInvalid}
                    fullWidth
                    id="payment-note"
                    value={paymentNote}
                    onChange={handlePaymentNoteChange}
                  />
                  {isPaymentNoteInvalid && (
                    <FormHelperText error>
                      {translate('QRGenerator.bodyPaymentNoteInvalid')}
                    </FormHelperText>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </View>
      <Footer>
        <Button
          disabled={isPaymentNoteInvalid || !amount || !validateAmount(amount)}
          fullWidth
          isPrimary
          onClick={handleShowQR}
        >
          {translate('QRGenerator.buttonShowQRCode')}
        </Button>
      </Footer>
    </Fragment>
  );
};

export default QRGenerator;
