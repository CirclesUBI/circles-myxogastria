import PropTypes from 'prop-types';
import React from 'react';

const ExternalLinkList = (props, context) => {
  return (
    <ul>
      <li>
        <a href="#" target="_blank">
          {context.t('ExternalLinkList.about')}
        </a>
      </li>

      <li>
        <a href="#" target="_blank">
          {context.t('ExternalLinkList.faq')}
        </a>
      </li>

      <li>
        <a href="#" target="_blank">
          {context.t('ExternalLinkList.marketplace')}
        </a>
      </li>

      <li>
        <a href="#" target="_blank">
          {context.t('ExternalLinkList.meetups')}
        </a>
      </li>

      <li>
        <a href="#" target="_blank">
          {context.t('ExternalLinkList.contact')}
        </a>
      </li>
    </ul>
  );
};

ExternalLinkList.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default ExternalLinkList;
