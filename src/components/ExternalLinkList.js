import React, { Fragment } from 'react';

import translate from '~/services/locale';

export const ABOUT_URL = 'https://joincircles.net';
export const CONTACT_URL = 'mailto:hello@joincircles.net';
export const FAQ_URL =
  'https://docs.google.com/document/d/1MS6IxQ3baMx_PJLJZ_KWpZYKHUKQ1JFkU4wHOW0P6OU';
export const FEEDBACK_URL = 'https://forms.gle/vWzF1NcAEb3qzjyd7';
export const MARKETPLACE_URL = 'https://t.me/CirclesUBI';

const ExternalLinkList = () => {
  return (
    <Fragment>
      <ul>
        <li>
          <a href={ABOUT_URL} rel="noopener noreferrer" target="_blank">
            {translate('ExternalLinkList.about')}
          </a>
        </li>

        <li>
          <a href={FAQ_URL} rel="noopener noreferrer" target="_blank">
            {translate('ExternalLinkList.faq')}
          </a>
        </li>

        <li>
          <a href={MARKETPLACE_URL} rel="noopener noreferrer" target="_blank">
            {translate('ExternalLinkList.marketplace')}
          </a>
        </li>

        <li>
          <a href={FEEDBACK_URL} rel="noopener noreferrer" target="_blank">
            {translate('ExternalLinkList.issue')}
          </a>
        </li>

        <li>
          <a href={CONTACT_URL}>{translate('ExternalLinkList.contact')}</a>
        </li>
      </ul>
    </Fragment>
  );
};

export default ExternalLinkList;
