import React from 'react';
import { MemoryRouter } from 'react-router-dom'
import Header from '../../src/components/Header';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Header component', () => {
  const props = {
    isAdmin: false,
    authFail: false,
    login () {},
    logoff () {}
  };

  describe('Header snapshot', () => {
    const header = mount(
      <MemoryRouter initialEntries={[ { key: 'testKey' } ]}>
        <Header { ...props }/>
      </MemoryRouter>
    );

    it('should fit snapshot', () => expect(shallowToJson(header)).toMatchSnapshot())
    it('should render h1', () => expect(header.find('h1').text()).toEqual('XRay-test'))
    it('should render Login component', () => expect(header.find('Login')).toHaveLength(1))
  })

  describe('Header logged in', () => {
    const mockLogoff = jest.fn();

    props.isAdmin = true;
    props.logoff = mockLogoff;

    const header = mount(
      <MemoryRouter initialEntries={[ { key: 'testKey' } ]}>
        <Header { ...props }/>
      </MemoryRouter>
    );

    it('should fit snapshot', () => expect(shallowToJson(header)).toMatchSnapshot())
    it('should call logoff fn when clicking on logoff link', () => {
      header.find('.logoff').simulate('click');
      expect(mockLogoff).toHaveBeenCalledTimes(1);
    });
  })
})
