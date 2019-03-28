import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import Header from '../../src/components/Header';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Header component', () => {
  const props = {
    isAdmin: false,
    authFail: false,
    login () {},
    logoff () {}
  };

  describe('Header initial', () => {
    const header = mount(
      <BrowserRouter>
        <Header { ...props }/>
      </BrowserRouter>
    );

    it('should render h1', () => expect(header.find('h1').text()).toEqual('XRay-test'))
    it('should render Login component', () => expect(header.find('Login')).toHaveLength(1))
  })
})
