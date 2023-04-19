import { Checkbox, FormControlLabel } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

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
  <Fragment>
    {translate('CheckboxPrivacy.checkboxLabel')}{' '}
    <ExternalLink href={PRIVACY_LEGAL_URL} underline="hover">
      {translate('CheckboxPrivacy.checkboxLink')}
    </ExternalLink>
  </Fragment>
);

CheckboxPrivacy.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CheckboxPrivacy;
