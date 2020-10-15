import PropTypes from 'prop-types';
import React, { Fragment, useState, useEffect } from 'react';

import Input from '~/components/Input';
import translate from '~/services/locale';

const MIN_PASSWORD_LENGTH = 8;

const VerifiedPasswordInput = ({ onChange, onStatusChange, value = '' }) => {
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const isInvalid = value.length > 0 && value.length < MIN_PASSWORD_LENGTH;
  const isConfirmationInvalid =
    passwordConfirmation.length > 0 && value !== passwordConfirmation;

  useEffect(() => {
    onStatusChange(
      isInvalid ||
        value.length === 0 ||
        passwordConfirmation.length === 0 ||
        isConfirmationInvalid,
    );
  }, [
    isConfirmationInvalid,
    isInvalid,
    onStatusChange,
    value,
    passwordConfirmation,
  ]);

  const handleChange = (event) => {
    const { name, value: newValue } = event.target;
    if (name === 'password') {
      onChange(newValue);
    } else {
      setPasswordConfirmation(newValue);
    }
  };
  return (
    <Fragment>
      <Input
        errorMessage={translate('VerifiedPasswordInput.formPasswordTooShort')}
        id="password"
        isError={isInvalid}
        label={translate('VerifiedPasswordInput.formPassword')}
        name="password"
        type="password"
        value={value}
        onChange={handleChange}
      />
      <Input
        errorMessage={translate(
          'VerifiedPasswordInput.formPasswordConfirmationWrong',
        )}
        id="passwordConfirmation"
        isError={isConfirmationInvalid}
        label={translate('VerifiedPasswordInput.formPasswordConfirmation')}
        name="passwordConfirmation"
        type="password"
        value={passwordConfirmation}
        onChange={handleChange}
      />
    </Fragment>
  );
};

VerifiedPasswordInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default VerifiedPasswordInput;
