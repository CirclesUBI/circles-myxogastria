import React, { Component } from 'react';

import Notifications from '~/components/Notifications';

export default class Header extends Component {
  render() {
    return (
      <header>
        <Notifications />
      </header>
    );
  }
}
