import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';

import Footer from '~/components/Footer';
import Header from '~/components/Header';
import View from '~/components/View';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  render() {
    return (
      <Fragment>
        <Header />
        <View>{this.props.children}</View>
        <Footer />
      </Fragment>
    );
  }
}
