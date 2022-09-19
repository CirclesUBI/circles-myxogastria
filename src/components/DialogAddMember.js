import { Box, Typography, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import Avatar from '~/components/Avatar';
import DialogPurple from '~/components/DialogPurple';
import ExternalLink from '~/components/ExternalLink';
import translate from '~/services/locale';
import { FAQ_URL } from '~/utils/constants';

const useParagraphStyles = makeStyles((theme) => ({
  paragraph: {
    color: theme.custom.colors.grayLightest,
  },
  link: {
    color: theme.custom.colors.grayLightest,
  },
}));

const DialogAddMember = ({
  username,
  address,
  handleAddMember,
  handleClose,
  isOpen,
  isOrganization,
}) => {
  const classes = useParagraphStyles();
  const confirmLabel = isOrganization
    ? null
    : translate('DialogAddMember.dialogConfirm');
  const dialogBody = isOrganization
    ? translate('DialogAddMember.dialogBodyCannotAdd')
    : translate('DialogAddMember.dialogBody');
  const onConfirm = isOrganization ? null : handleAddMember;

  return (
    <DialogPurple
      cancelLabel={translate('DialogAddMember.dialogCancel')}
      confirmLabel={confirmLabel}
      open={isOpen}
      title={translate('DialogAddMember.dialogTitle', { username })}
      onClose={handleClose}
      onConfirm={onConfirm}
    >
      <Box display="flex" justifyContent="center" mb={2}>
        <Avatar address={address} size="medium" />
      </Box>
      <Typography className={classes.paragraph} paragraph>
        {dialogBody}
      </Typography>
      <ExternalLink className={classes.link} href={FAQ_URL} underline="always">
        <Typography paragraph>
          {translate('DialogAddMember.linkLearnMore')}
        </Typography>
      </ExternalLink>
    </DialogPurple>
  );
};

DialogAddMember.propTypes = {
  address: PropTypes.string,
  handleAddMember: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOrganization: PropTypes.bool,
  username: PropTypes.string.isRequired,
};

export default DialogAddMember;
