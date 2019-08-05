import { shallow } from 'enzyme';
import React from 'react';

import Hello from '../src/components/Hello';

it('welcomes us', () => {
  const hello = shallow(<Hello name="Baby Phoenix" />);

  expect(hello.text()).toEqual('Hello Baby Phoenix!');
});
