import React from 'react';

import render from './utils/render';

import Notifications from '~/components/Notifications';
import notificationsReducer from '~/store/notifications/reducers';
import notify, { NotificationsTypes } from '~/store/notifications/actions';

describe('Notifications component', () => {
  const text = 'NERV system infected by Ireul';

  let container;
  let store;

  beforeEach(() => {
    const reducers = {
      notifications: notificationsReducer,
    };

    const api = render(<Notifications />, {
      reducers,
    });

    container = api.container;
    store = api.store;

    store.dispatch(
      notify({
        type: NotificationsTypes.ERROR,
        text,
      }),
    );
  });

  describe('when dispatching a new notification', () => {
    it('should show the text message to the user', () => {
      expect(container.textContent).toContain(text);
    });
  });
});
