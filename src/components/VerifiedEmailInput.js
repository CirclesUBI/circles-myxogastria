import PropTypes from 'prop-types';
import React, { useCallback, useState, useEffect } from 'react';

import Input from '~/components/Input';
import core from '~/services/core';
import debounce from '~/utils/debounce';
import translate from '~/services/locale';

const DEBOUNCE_DELAY = 500;

const VerifiedEmailInput = ({
  label,
  onChange,
  onStatusChange,
  value = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedEmailCheck = useCallback(
    debounce(async (email) => {
      try {
        await core.utils.requestAPI({
          path: ['users'],
          method: 'POST',
          data: {
            email,
          },
        });

        setIsError(false);
      } catch {
        setIsError(true);
      }

      setIsLoading(false);
    }, DEBOUNCE_DELAY),
    [],
  );

  const verify = useCallback(
    (email) => {
      if (email.length < 3) {
        setIsError(true);
        setIsLoading(false);
        return;
      }

      setIsError(false);
      setIsLoading(true);

      debouncedEmailCheck(email);
    },
    [debouncedEmailCheck],
  );

  const handleChange = (event) => {
    const { value } = event.target;
    onChange(value);
    verify(value);
  };

  useEffect(() => {
    onStatusChange(!value.length > 0 || isError || isLoading);
  }, [value, onStatusChange, isError, isLoading]);

  return (
    <Input
      errorMessage={translate('VerifiedEmailInput.formEmailInvalid')}
      id="email"
      isError={isError}
      isLoading={isLoading}
      label={label}
      type="email"
      value={value}
      onChange={handleChange}
    />
  );
};

VerifiedEmailInput.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default VerifiedEmailInput;
