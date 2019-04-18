import React from 'react';
import { MemoryRouter } from 'react-router-dom'
import Forbidden from '../../src/components/Forbidden';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Forbidden component', () => {
  it('should render correct', () => {
      const p404 = mount(
        <MemoryRouter initialEntries={[ { key: 'testKey' } ]}>
          <Forbidden/>
        </MemoryRouter>
      );

      expect(shallowToJson(p404)).toMatchSnapshot()
  })
})
