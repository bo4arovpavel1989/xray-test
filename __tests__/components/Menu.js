import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import Menu from '../../src/components/Menu';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Menu component', () => {
  it('should render correct', () => {
      const menu = mount(
        <BrowserRouter>
          <Menu/>
        </BrowserRouter>
      );

      expect(shallowToJson(menu)).toMatchSnapshot()
  })
})
