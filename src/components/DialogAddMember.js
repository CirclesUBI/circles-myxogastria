import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import Avatar from '~/components/Avatar';
import DialogPurple from '~/components/DialogPurple';
import ExternalLink from '~/components/ExternalLink';
import translate from '~/services/locale';
import { FAQ_URL } from '~/utils/constants';

const DialogAddMember = ({
  username,
  address,
  handleAddMember,
  handleClose,
  isOpen,
  isOrganization,
}) => {
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
      title={
        <Typography classes={{ root: 'h4_link_white' }} variant="h4">
          {translate('DialogAddMember.dialogTitle', { username })}
        </Typography>
      }
      onClose={handleClose}
      onConfirm={onConfirm}
    >
      <Box display="flex" justifyContent="center" mb={2}>
        <Avatar address={address} size="medium" />
      </Box>
      <Typography
        align="center"
        classes={{ root: 'body1_white' }}
        paragraph
        variant="body1"
      >
        {dialogBody}
      </Typography>
      <ExternalLink href={FAQ_URL} underline="always">
        <Typography
          align="center"
          classes={{ root: 'body3_link' }}
          paragraph
          variant="body3"
        >
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
