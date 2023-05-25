import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import ExternalLink from '~/components/ExternalLink';
import translate from '~/services/locale';
import { PRIVACY_LEGAL_URL } from '~/utils/constants';

const CheckboxPrivacy = (props) => {
  return (
    <FormControlLabel
      checked={props.checked}
      control={<Checkbox color="secondary" />}
      label={<CheckboxPrivacyLabel />}
      onChange={props.onChange}
    />
  );
};

const CheckboxPrivacyLabel = () => (
  <Typography>
    {translate('CheckboxPrivacy.checkboxLabel')}{' '}
    <ExternalLink
      classes={{ root: 'body3_link_gradient' }}
      href={PRIVACY_LEGAL_URL}
      variant="body3"
    >
      {translate('CheckboxPrivacy.checkboxLink')}
    </ExternalLink>
  </Typography>
);

CheckboxPrivacy.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CheckboxPrivacy;
