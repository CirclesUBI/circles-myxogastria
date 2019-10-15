import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import styles from '~/styles/variables';

import background from '~/../assets/images/background-orange-bottom.svg';

const ExternalLinkList = (props, context) => {
  return (
    <ListStyle>
      <ListItemStyle>
        <a href="#" target="_blank">
          {context.t('ExternalLinkList.about')}
        </a>
      </ListItemStyle>

      <ListItemStyle>
        <a href="#" target="_blank">
          {context.t('ExternalLinkList.faq')}
        </a>
      </ListItemStyle>

      <ListItemStyle>
        <a href="#" target="_blank">
          {context.t('ExternalLinkList.marketplace')}
        </a>
      </ListItemStyle>

      <ListItemStyle>
        <a href="#" target="_blank">
          {context.t('ExternalLinkList.meetups')}
        </a>
      </ListItemStyle>

      <ListItemStyle>
        <a href="#" target="_blank">
          {context.t('ExternalLinkList.contact')}
        </a>
      </ListItemStyle>
    </ListStyle>
  );
};

ExternalLinkList.contextTypes = {
  t: PropTypes.func.isRequired,
};

const ListStyle = styled.ul`
  margin-right: -${styles.base.layout.spacing};
  margin-left: -${styles.base.layout.spacing};
  padding: 2rem;
  padding-top: 3rem;

  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
`;

const ListItemStyle = styled.li`
  font-weight: ${styles.base.typography.weightLight};
  font-size: 1.1em;

  a {
    color: ${styles.monochrome.white};
  }
`;

export default ExternalLinkList;
