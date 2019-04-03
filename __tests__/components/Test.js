import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import Test from '../../src/components/Test';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Test component', () => {
  it('should render correct', () => {
      const component = mount(
        <BrowserRouter>
          <Test/>
        </BrowserRouter>
      );

      expect(shallowToJson(component)).toMatchSnapshot()
  })
})
