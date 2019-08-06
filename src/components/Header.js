import React from 'react';

import AccountAddress from '~/components/AccountAddress';
import Notifications from '~/components/Notifications';

const Header = () => {
  return (
    <header>
      <AccountAddress />
      <Notifications />
    </header>
  );
};

export default Header;
