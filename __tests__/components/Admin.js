import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import Admin from '../../src/components/Admin';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Admin component', () => {
  it('should render correct', () => {
      const admin = mount(
        <BrowserRouter>
          <Admin/>
        </BrowserRouter>
      );

      expect(shallowToJson(admin)).toMatchSnapshot()
  })
})
