import PropTypes from 'prop-types';
import React, { useCallback, useState, useEffect } from 'react';

import Input from '~/components/Input';
import core from '~/services/core';
import debounce from '~/utils/debounce';
import translate from '~/services/locale';

const DEBOUNCE_DELAY = 500;
const MAX_USERNAME_LENGTH = 24;

const VerifiedUsernameInput = ({
  label,
  onChange,
  onStatusChange,
  value = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (event) => {
    const { value } = event.target;
    onChange(value);
    verify(value);
  };

  useEffect(() => {
    onStatusChange(value.length === 0 || isError || isLoading);
  }, [value, onStatusChange, isError, isLoading]);

  const [errorMessage, setErrorMessage] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUsernameCheck = useCallback(
    debounce(async (username) => {
      try {
        await core.utils.requestAPI({
          path: ['users'],
          method: 'POST',
          data: {
            username,
          },
        });

        setIsError(false);
      } catch (error) {
        if (error.request.status === 400) {
          setErrorMessage(
            translate('VerifiedUsernameInput.formUsernameInvalidFormat'),
          );
        } else if (error.request.status === 409) {
          setErrorMessage(translate('VerifiedUsernameInput.formUsernameTaken'));
        } else {
          setErrorMessage(translate('VerifiedUsernameInput.formUnknownError'));
        }

        setIsError(true);
      }

      setIsLoading(false);
    }, DEBOUNCE_DELAY),
    [],
  );

  const verify = useCallback(
    (username) => {
      setIsError(false);
      setIsLoading(true);
      debouncedUsernameCheck(username);
    },
    [debouncedUsernameCheck],
  );

  return (
    <Input
      errorMessage={errorMessage}
      id="username"
      inputProps={{ maxLength: MAX_USERNAME_LENGTH }}
      isError={isError}
      isLoading={isLoading}
      label={label}
      type="text"
      value={value}
      onChange={handleChange}
    />
  );
};

VerifiedUsernameInput.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default VerifiedUsernameInput;
