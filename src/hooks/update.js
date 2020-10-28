import { useEffect } from 'react';

const DEFAULT_LOOP_FREQUENCY =
  process.env.NODE_ENV === 'development' ? 1000 * 10 : 1000 * 30;

export function useUpdateLoop(
  fn,
  { frequency = DEFAULT_LOOP_FREQUENCY, isRequestOnLoad = true } = {},
) {
  useEffect(() => {
    let isUnloaded = false;
    let isPending = false;
    let timeout;

    const request = async () => {
      // Skip request when another one is already running or component was
      // already unloaded
      if (isPending || isUnloaded) {
        return;
      }

      isPending = true;

      // Do the actual request
      await fn();

      // Do not restart when component was already unloaded
      if (isUnloaded) {
        return;
      }

      isPending = false;

      // Restart request in x milliseconds
      timeout = window.setTimeout(request, frequency);
    };

    // Always do the request on first load
    if (isRequestOnLoad) {
      request();
    } else {
      timeout = window.setTimeout(request, frequency);
    }

    return () => {
      isUnloaded = true;
      window.clearTimeout(timeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
