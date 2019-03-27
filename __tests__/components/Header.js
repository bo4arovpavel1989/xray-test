import React from 'react';
import Header from '../../src/components/Header';
import { Enzyme, shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

it('renders correctly', () => {
  const output = shallow(<Header/>);

  expect(shallowToJson(output)).toMatchSnapshot();
})
