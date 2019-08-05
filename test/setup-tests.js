// @NOTE: https://github.com/FormidableLabs/enzyme-matchers/tree/master/packages/jest-enzyme#jest-enzyme-environment
import 'jest-enzyme';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
