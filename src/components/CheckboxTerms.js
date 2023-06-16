import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import ExternalLink from '~/components/ExternalLink';
import translate from '~/services/locale';
import { TERMS_URL } from '~/utils/constants';

const CheckboxTerms = (props) => {
  return (
    <FormControlLabel
      checked={props.checked}
      control={<Checkbox color="secondary" />}
      label={<CheckboxTermsLabel />}
      onChange={props.onChange}
    />
  );
};

const CheckboxTermsLabel = () => (
  <Typography>
    {translate('CheckboxTerms.checkboxLabel')}{' '}
    <ExternalLink
      classes={{ root: 'body3_link_gradient' }}
      href={TERMS_URL}
      variant="body3"
    >
      {translate('CheckboxTerms.checkboxLink')}
    </ExternalLink>
  </Typography>
);

CheckboxTerms.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CheckboxTerms;
