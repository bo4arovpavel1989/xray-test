import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import Login from '../../src/components/Header/Login.js';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Login component', () => {
  const props = {
    authFail: false,
    isLogging: false,
    login: jest.fn()
  };

  it('should render correct', () => {
      const login = mount(
        <BrowserRouter>
          <Login { ...props }/>
        </BrowserRouter>
      );

      expect(shallowToJson(login)).toMatchSnapshot()
  })

  it('should render corect when logging failed', () => {
    props.authFail = true;
    const login = mount(
      <BrowserRouter>
        <Login { ...props }/>
      </BrowserRouter>
    );

    expect(shallowToJson(login)).toMatchSnapshot()
  })

  it('should render disable submit when logging', () => {
    props.authFail = false;
    props.isLogging = true;
    const login = mount(
      <BrowserRouter>
        <Login { ...props }/>
      </BrowserRouter>
    );

    expect(shallowToJson(login)).toMatchSnapshot()
  })

  it('should call login function on submit', () => {
    props.authFail = false;
    props.isLogging = false;
    const login = mount(
      <BrowserRouter>
        <Login { ...props }/>
      </BrowserRouter>
    );

    login.find('form').simulate('submit');
    expect(props.login).toHaveBeenCalledTimes(1);
  })
})
