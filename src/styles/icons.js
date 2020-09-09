import React from 'react';
import { SvgIcon } from '@material-ui/core';

import arrow from '%/images/arrow.svg';
import check from '%/images/check.svg';
import close from '%/images/close.svg';
import menu from '%/images/menu.svg';
import notification from '%/images/notification.svg';

export const IconCheck = (props) => {
  return <SvgIcon component={check} viewBox="0 0 512 512" {...props} />;
};

export const IconMenu = (props) => {
  return <SvgIcon component={menu} {...props} />;
};

export const IconNotification = (props) => {
  return <SvgIcon component={notification} {...props} viewBox="0 0 29 34" />;
};

export const IconBack = (props) => {
  return <SvgIcon component={arrow} {...props} viewBox="0 0 12 18" />;
};

export const IconClose = (props) => {
  return <SvgIcon component={close} {...props} viewBox="0 0 20 20" />;
};
