import PropTypes from 'prop-types';
import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { render } from '@testing-library/react';

import locales from 'locales';

const TestRoot = ({ store, children }) => {
  return <Provider store={store}>{children}</Provider>;
};

TestRoot.propTypes = {
  children: PropTypes.element.isRequired,
  store: PropTypes.object.isRequired,
};

const middlewares = [thunk];

const renderWithRedux = (ui, options) => {
  const { initialState = {}, reducers = {} } = options;

  const rootReducer = combineReducers({
    ...reducers,
  });

  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middlewares),
  );

  return {
    ...render(
      <TestRoot store={store} translations={locales}>
        {ui}
      </TestRoot>,
    ),
    store,
  };
};

export default renderWithRedux;
