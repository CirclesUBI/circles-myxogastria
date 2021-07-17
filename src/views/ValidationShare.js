import { Container, Typography } from '@material-ui/core';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonShare from '~/components/ButtonShare';
import Centered from '~/components/Centered';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import ShareBox from '~/components/ShareBox';
import View from '~/components/View';
import { useProfileLink } from '~/hooks/url';
import translate from '~/services/locale';

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
          <ShareBox address={safe.pendingAddress} />
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
