import { Container } from '@material-ui/core';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import ButtonBack from '~/components/ButtonBack';
import ButtonShare from '~/components/ButtonShare';
import CenteredHeading from '~/components/CenteredHeading';
import Footer from '~/components/Footer';
import Header from '~/components/Header';
import ShareBox from '~/components/ShareBox';
import View from '~/components/View';
import { useProfileLink } from '~/hooks/url';
import translate from '~/services/locale';

const Share = () => {
  const safe = useSelector((state) => state.safe);
  const shareLink = useProfileLink(safe.currentAccount);
  const shareText = translate('Share.shareText', { shareLink });

  return (
    <Fragment>
      <Header>
        <ButtonBack />
        <CenteredHeading>{translate('Share.headingShare')}</CenteredHeading>
      </Header>
      <View>
        <Container maxWidth="sm">
          <ShareBox address={safe.currentAccount} />
        </Container>
      </View>
      <Footer>
        <ButtonShare fullWidth isPrimary text={shareText} url={shareLink}>
          {translate('Share.buttonShareProfileLink')}
        </ButtonShare>
      </Footer>
    </Fragment>
  );
};

export default Share;
