import { render } from '@testing-library/react';
import locales from 'locales';
import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

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
