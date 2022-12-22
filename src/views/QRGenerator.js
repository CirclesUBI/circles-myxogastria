import {
  Box,
  Card,
  CardHeader,
  Container,
  Dialog,
  DialogContent,
  Grid,
  InputLabel,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { saveAs } from 'file-saver';
import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';

import Avatar from '~/components/Avatar';
import Button from '~/components/Button';
import ButtonBack from '~/components/ButtonBack';
import ButtonShare from '~/components/ButtonShare';
import CenteredHeading from '~/components/CenteredHeading';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import QRCode from '~/components/QRCode';
import TransferCirclesInput from '~/components/TransferCirclesInput';
import TransferInput from '~/components/TransferInput';
import View from '~/components/View';
import { useSendLink } from '~/hooks/url';
import { useUserdata } from '~/hooks/username';
import translate from '~/services/locale';
import { validateAmount, validatePaymentNote } from '~/services/token';

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
            <ButtonShare fullWidth isOutline text="" url={data}>
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
              <TransferCirclesInput
                autoFocus
                id="amount"
                label={translate('QRGenerator.formAmount')}
                value={amount}
                onChange={handleAmountChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TransferInput
                errorMessage={translate('QRGenerator.bodyPaymentNoteInvalid')}
                id="payment-note"
                isError={isPaymentNoteInvalid}
                label={translate('QRGenerator.formPaymentNote')}
                value={paymentNote}
                onChange={handlePaymentNoteChange}
              />
            </Grid>
          </Grid>
        </Container>
      </View>
      <Footer>
        <Button
          disabled={isPaymentNoteInvalid || !amount || !validateAmount(amount)}
          fullWidth
          onClick={handleShowQR}
        >
          {translate('QRGenerator.buttonShowQRCode')}
        </Button>
      </Footer>
    </Fragment>
  );
};

export default QRGenerator;
