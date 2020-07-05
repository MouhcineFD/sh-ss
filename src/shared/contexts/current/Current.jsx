import React from 'react';

import { Consumer } from './Context';

const Current = WrappedComponent => props => (
  <Consumer>
    {value => <WrappedComponent {...props} {...{ current: value }} />}
  </Consumer>
);

export default Current;
