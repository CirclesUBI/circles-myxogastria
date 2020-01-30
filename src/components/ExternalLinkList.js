import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';
import { BackgroundOrangeBottom } from '~/styles/Background';

const ExternalLinkList = (props, context) => {
  return (
    <Background>
      <PushToBottomStyle />

      <ListStyle>
        <ListItemStyle>
          <a
            href="https://joincircles.net/"
            rel="noopener noreferrer"
            target="_blank"
          >
            {context.t('ExternalLinkList.about')}
          </a>
        </ListItemStyle>

        <ListItemStyle>
          <a
            href="https://docs.google.com/document/d/1MS6IxQ3baMx_PJLJZ_KWpZYKHUKQ1JFkU4wHOW0P6OU"
            rel="noopener noreferrer"
            target="_blank"
          >
            {context.t('ExternalLinkList.faq')}
          </a>
        </ListItemStyle>

        <ListItemStyle>
          <a
            href="https://chat.joincircles.net/group/marketplace-testphase"
            rel="noopener noreferrer"
            target="_blank"
          >
            {context.t('ExternalLinkList.marketplace')}
          </a>
        </ListItemStyle>

        <ListItemStyle>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdunAf6EhAEizcsiopidKmLEiKyI3mCqU6YZS8V4makMxWVyA/viewform"
            rel="noopener noreferrer"
            target="_blank"
          >
            {context.t('ExternalLinkList.issue')}
          </a>
        </ListItemStyle>

        <ListItemStyle>
          <a href="mailto:hello@joincircles.net">
            {context.t('ExternalLinkList.contact')}
          </a>
        </ListItemStyle>
      </ListStyle>
    </Background>
  );
};

ExternalLinkList.contextTypes = {
  t: PropTypes.func.isRequired,
};

const PushToBottomStyle = styled.div`
  flex: 1 0 auto;
`;

const Background = styled(BackgroundOrangeBottom)`
  height: auto;

  margin-right: -${styles.base.layout.spacing};
  margin-left: -${styles.base.layout.spacing};
`;

const ListStyle = styled.ul`
  padding: 2rem;
  padding-top: 3rem;

  flex-shrink: 0;
`;

const ListItemStyle = styled.li`
  font-weight: ${styles.base.typography.weightLight};
  font-size: 1.1em;

  a {
    color: ${styles.monochrome.white};
  }
`;

export default ExternalLinkList;
