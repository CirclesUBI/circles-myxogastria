import React from 'react';
import { SvgIcon } from '@material-ui/core';

import arrow from '%/images/arrow.svg';
import check from '%/images/check.svg';
import close from '%/images/close.svg';
import facebook from '%/images/facebook.svg';
import mail from '%/images/mail.svg';
import menu from '%/images/menu.svg';
import notification from '%/images/notification.svg';
import send from '%/images/send.svg';
import telegram from '%/images/telegram.svg';
import twitter from '%/images/twitter.svg';

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

export const IconSend = (props) => {
  return <SvgIcon component={send} {...props} viewBox="0 0 36 36" />;
};

export const IconClose = (props) => {
  return <SvgIcon component={close} {...props} viewBox="0 0 20 20" />;
};

export const IconTelegram = (props) => {
  return <SvgIcon component={telegram} {...props} viewBox="0 0 21 20" />;
};

export const IconFacebook = (props) => {
  return <SvgIcon component={facebook} {...props} viewBox="0 0 11 20" />;
};

export const IconTwitter = (props) => {
  return <SvgIcon component={twitter} {...props} viewBox="0 0 21 18" />;
};

export const IconMail = (props) => {
  return <SvgIcon component={mail} {...props} viewBox="0 0 21 18" />;
};
