import React from 'react';
import { MemoryRouter } from 'react-router-dom'
import { Admin } from '../../src/components/Admin';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Admin component', () => {
  window.alert = jest.fn();

  const props = {
    postFile: jest.fn(() => new Promise((res, rej) => res({ success: true }))),
    postData: jest.fn(() => new Promise((res, rej) => res({ success: true }))),
    getData: jest.fn(() => new Promise((res, rej) => res([{ name: 'test', _id: 'testID' }]))),
    deleteData: jest.fn(() => new Promise((res, rej) => res({ success: true })))
  }
  const component = mount(
    <MemoryRouter>
      <Admin { ...props }/>
    </MemoryRouter>
  );

  it('should render correct', () => {
      expect(shallowToJson(component)).toMatchSnapshot()
  })

  it('should call 3 initial getData (tests, settings, questions) functions', () => {
    expect(props.getData).toHaveBeenCalledTimes(3)
  })

  it('should update teste state on getting data', () => {
    expect(component.find(Admin).instance().state.tests).toEqual([{ name: 'test', _id: 'testID' }])
  })

  it('should update questions state on getting data', () => {
    expect(component.find(Admin).instance().state.questions).toEqual([{ name: 'test', _id: 'testID' }])
  })

  it('should update settings state on getting data', () => {
    expect(component.find(Admin).instance().state.settings).toEqual([{ name: 'test', _id: 'testID' }])
  })
})
