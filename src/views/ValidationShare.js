import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Box, Container, Typography } from '@material-ui/core';

import Avatar from '~/components/Avatar';
import ButtonBack from '~/components/ButtonBack';
import ButtonShare from '~/components/ButtonShare';
import Centered from '~/components/Centered';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import QRCode from '~/components/QRCode';
import UsernameDisplay from '~/components/UsernameDisplay';
import View from '~/components/View';
import translate from '~/services/locale';
import { useProfileLink } from '~/hooks/url';

const ValidationShare = () => {
  const safe = useSelector((state) => state.safe);
  const shareLink = useProfileLink(safe.pendingAddress);
  const shareText = translate('ValidationShare.shareText', { shareLink });

  return (
    <Fragment>
      <Header>
        <ButtonBack />
        <Centered>
          <Typography align="center">
            {translate('ValidationShare.headingShowYourQR')}
          </Typography>
        </Centered>
      </Header>
      <View>
        <Container maxWidth="sm">
          <Box mb={2} mt={4}>
            <QRCode data={shareLink}>
              <Box mb={2}>
                <Avatar address={safe.pendingAddress} size={100} />
              </Box>
              <Typography align="center" component="span" variant="h6">
                <UsernameDisplay address={safe.pendingAddress} />
              </Typography>
            </QRCode>
          </Box>
        </Container>
      </View>
      <Footer>
        <ButtonShare fullWidth isOutline text={shareText} url={shareLink}>
          {translate('ValidationShare.buttonShareProfileLink')}
        </ButtonShare>
      </Footer>
    </Fragment>
  );
};

export default ValidationShare;
