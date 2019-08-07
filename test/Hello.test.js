import React from 'react';
import ReactDOM from 'react-dom';

import Hello from '~/components/Hello';

describe('Hello component', () => {
  it('should welcome us', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Hello name="Baby Phoenix" />, div);

    expect(div.textContent).toBe('Hello Baby Phoenix!');
  });
});
