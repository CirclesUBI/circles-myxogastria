import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';

const App = props => {
  return (
    <Fragment>
      <Header />
      <View>{props.children}</View>
      <Footer />
    </Fragment>
  );
};

App.propTypes = {
  children: PropTypes.element.isRequired,
};

export default App;
