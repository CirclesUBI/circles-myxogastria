import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';
import { BackgroundOrangeBottom } from '~/styles/Background';

export const ABOUT_URL = 'https://joincircles.net';
export const CONTACT_URL = 'mailto:hello@joincircles.net';
export const FAQ_URL =
  'https://docs.google.com/document/d/1MS6IxQ3baMx_PJLJZ_KWpZYKHUKQ1JFkU4wHOW0P6OU';
export const FEEDBACK_URL = 'https://forms.gle/vWzF1NcAEb3qzjyd7';
export const MARKETPLACE_URL = 'https://t.me/CirclesUBI';

const ExternalLinkList = (props, context) => {
  return (
    <Background>
      <PushToBottomStyle />

      <ListStyle>
        <ListItemStyle>
          <a href={ABOUT_URL} rel="noopener noreferrer" target="_blank">
            {context.t('ExternalLinkList.about')}
          </a>
        </ListItemStyle>

        <ListItemStyle>
          <a href={FAQ_URL} rel="noopener noreferrer" target="_blank">
            {context.t('ExternalLinkList.faq')}
          </a>
        </ListItemStyle>

        <ListItemStyle>
          <a href={MARKETPLACE_URL} rel="noopener noreferrer" target="_blank">
            {context.t('ExternalLinkList.marketplace')}
          </a>
        </ListItemStyle>

        <ListItemStyle>
          <a href={FEEDBACK_URL} rel="noopener noreferrer" target="_blank">
            {context.t('ExternalLinkList.issue')}
          </a>
        </ListItemStyle>

        <ListItemStyle>
          <a href={CONTACT_URL}>{context.t('ExternalLinkList.contact')}</a>
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
`;

export default ExternalLinkList;
