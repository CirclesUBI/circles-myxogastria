import { loop, wait, waitAndRetryOnFail } from '~/utils/stateChecks';

const CONDITION_RESULT_SUCCESS = 'success';
const CONDITION_RESULT_FAILED = 'failed';
const RESULT_ERROR = 'Something failed ...';

describe('stateChecks Utils', () => {
  let mocks;
  let attempt;

  beforeAll(() => {
    mocks = {
      // Mock any successful request waiting for x milliseconds, returning any
      // result which can be checked
      request: async (result = CONDITION_RESULT_SUCCESS) => {
        await wait(50);
        return result;
      },
      // Mock any failed request waiting for x milliseconds, throwing an
      // exception
      requestFailed: async (message = RESULT_ERROR) => {
        await wait(50);
        throw new Error(message);
      },
      conditionRequest: async (successAfter = 5) => {
        await wait(50);
        attempt += 1;

        if (attempt >= successAfter) {
          return CONDITION_RESULT_SUCCESS;
        } else {
          return CONDITION_RESULT_FAILED;
        }
      },
      // Check an incoming result and compare it with a condition
      condition: (result, condition = CONDITION_RESULT_SUCCESS) => {
        return result === condition;
      },
    };
  });

  beforeEach(() => {
    attempt = 0;
    jest.clearAllMocks();
  });

  describe('loop', () => {
    it('should return the result of the request when successful', async () => {
      const spyRequest = jest.spyOn(mocks, 'request');
      const spyCondition = jest.spyOn(mocks, 'condition');

      const response = await loop(
        () => {
          return mocks.request();
        },
        (result) => {
          return mocks.condition(result);
        },
      );

      expect(spyRequest).toHaveBeenCalledTimes(1);
      expect(spyCondition).toHaveBeenCalledTimes(1);
      expect(response).toBe(CONDITION_RESULT_SUCCESS);
    });

    it('should throw an exception when trying too many times', async () => {
      const spyRequest = jest.spyOn(mocks, 'request');
      const spyCondition = jest.spyOn(mocks, 'condition');

      await expect(async () => {
        await loop(
          () => {
            return mocks.request(CONDITION_RESULT_FAILED);
          },
          (result) => {
            return mocks.condition(result);
          },
          {
            maxAttempts: 2,
            loopInterval: 100,
          },
        );
      }).rejects.toThrow('Tried too many times waiting for condition.');

      expect(spyRequest).toHaveBeenCalledTimes(2);
      expect(spyCondition).toHaveBeenCalledTimes(2);
    });

    it('should propagate exception when request failed', async () => {
      await expect(async () => {
        await loop(
          () => {
            return mocks.requestFailed();
          },
          (result) => {
            return mocks.condition(result);
          },
        );
      }).rejects.toThrow(RESULT_ERROR);
    });
  });

  describe('waitAndRetryOnFail', () => {
    it('should return the result of the request when successful', async () => {
      const spyRequest = jest.spyOn(mocks, 'request');
      const spyConditionRequest = jest.spyOn(mocks, 'conditionRequest');
      const spyConditionCheck = jest.spyOn(mocks, 'condition');

      const response = await waitAndRetryOnFail(
        () => {
          return mocks.request();
        },
        async () => {
          await loop(
            () => {
              return mocks.conditionRequest(2);
            },
            (result) => {
              return mocks.condition(result);
            },
            {
              maxAttempts: 10,
              loopInterval: 75,
            },
          );
        },
        {
          maxAttemptsOnFail: 3,
        },
      );

      expect(spyRequest).toHaveBeenCalledTimes(1);
      expect(spyConditionRequest).toHaveBeenCalledTimes(2);
      expect(spyConditionCheck).toHaveBeenCalledTimes(2);
      expect(response).toBe(CONDITION_RESULT_SUCCESS);
    });

    it('should throw an exception when condition was not met after some attempts', async () => {
      const spyRequest = jest.spyOn(mocks, 'request');
      const spyConditionRequest = jest.spyOn(mocks, 'conditionRequest');
      const spyConditionCheck = jest.spyOn(mocks, 'condition');

      await expect(async () => {
        await waitAndRetryOnFail(
          () => {
            return mocks.request();
          },
          async () => {
            await loop(
              () => {
                return mocks.conditionRequest(100);
              },
              (result) => {
                return mocks.condition(result);
              },
              {
                maxAttempts: 5,
                loopInterval: 75,
              },
            );
          },
          {
            maxAttemptsOnFail: 3,
          },
        );
      }).rejects.toThrow('Tried too many times waiting for condition.');

      expect(spyRequest).toHaveBeenCalledTimes(3);
      expect(spyConditionRequest).toHaveBeenCalledTimes(15);
      expect(spyConditionCheck).toHaveBeenCalledTimes(15);
    });

    it('should propagate the error when request failed after all attempts', async () => {
      const spyRequestFailed = jest.spyOn(mocks, 'requestFailed');

      await expect(async () => {
        await waitAndRetryOnFail(
          mocks.requestFailed,
          () => {
            // The condition is always successful, this time we're checking a
            // failed request
            return true;
          },
          {
            maxAttemptsOnFail: 3,
            waitAfterFail: 100,
          },
        );
      }).rejects.toThrow(RESULT_ERROR);

      expect(spyRequestFailed).toHaveBeenCalledTimes(3);
    });
  });
});
