import I18n from 'redux-i18n';
import PropTypes from 'prop-types';
import React from 'react';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { i18nState } from 'redux-i18n';
import { render } from '@testing-library/react';

import locales from 'locales';

const TestRoot = ({ store, translations, children }) => {
  return (
    <Provider store={store}>
      <I18n translations={translations}>{children}</I18n>
    </Provider>
  );
};

TestRoot.propTypes = {
  children: PropTypes.element.isRequired,
  store: PropTypes.object.isRequired,
  translations: PropTypes.object.isRequired,
};

const middlewares = [thunk];

const renderWithRedux = (ui, options) => {
  const { initialState = {}, reducers = {} } = options;

  const rootReducer = combineReducers({
    ...reducers,
    i18nState,
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
    translations: locales,
  };
};

export default renderWithRedux;
