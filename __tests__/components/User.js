import React from 'react';
import { MemoryRouter } from 'react-router-dom'
import { User } from '../../src/components/Test/User';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Menu component', () => {
  const props = {
    handleChange: jest.fn(),
    handleSubmit: jest.fn()
  };
  const component = mount(
    <MemoryRouter initialEntries={[ { key: 'testKey' } ]}>
      <User { ...props }/>
    </MemoryRouter>
  );

  it('should render correct', () => {
    expect(shallowToJson(component)).toMatchSnapshot()
  })
})
