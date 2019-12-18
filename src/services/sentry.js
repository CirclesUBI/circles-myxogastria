import * as Sentry from '@sentry/browser';
import core from '~/services/core';

const { TransferError, RequestError, CoreError } = core.errors;

export default function initializeSentry() {
  if (!process.env.SENTRY_DSN_URL) {
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN_URL,
    environment: process.env.NODE_ENV,
    release: process.env.RELEASE_VERSION,
    beforeSend: (event, hint) => {
      const exception = hint.originalException;

      if (exception instanceof RequestError) {
        event.fingerprint = [
          '{{ default }}',
          'Type: RequestError',
          `Message: ${exception.message}`,
          exception.code,
          exception.request.url,
          exception.request.status,
        ];
      } else if (exception instanceof TransferError) {
        event.fingerprint = [
          '{{ default }}',
          'Type: TransferError',
          `Message: ${exception.message}`,
          exception.from,
          exception.to,
          exception.value,
        ];
      } else if (exception instanceof CoreError) {
        event.fingerprint = [
          '{{ default }}',
          'Type: CoreError',
          `Message: ${exception.message}`,
        ];
      }

      return event;
    },
  });
}

export function setUser(safeAddress, username) {
  if (!process.env.SENTRY_DSN_URL) {
    return;
  }

  Sentry.configureScope(scope => {
    scope.setUser({
      id: safeAddress,
      username,
    });
  });
}

export function captureException(error, data = {}) {
  if (!process.env.SENTRY_DSN_URL) {
    return;
  }

  Sentry.configureScope(scope => {
    Object.keys(data).forEach(key => {
      scope.setExtra(key, data[key]);
    });

    Sentry.captureException(error);
  });
}
