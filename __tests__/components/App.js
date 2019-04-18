import React from 'react';
import App from '../../src/components/App';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('App', () => {
  const props = {
    setToken: jest.fn(),
    postData: jest.fn(() => new Promise((res, rej) => res({ auth: true, token: 'testToken' })))
  };
  const initialState = {
    isAdmin: false,
    authFail: false,
    isLogging: false,
    token: undefined
  }
  const app = mount(<App { ...props }/>);

  it('should render correct', () => {
      expect(shallowToJson(app)).toMatchSnapshot()
  });

  describe('should handle login', () => {
    const e = {
      preventDefault: jest.fn(),
      target: {
        login: { value: 'testLogin' },
        password: { value: 'testPassword' }
      }
    };
    const data = {
      login: e.target.login.value,
      password: e.target.password.value
    };

    beforeAll(() => {
      return app.instance().login(e);
    })

    afterAll(() => {
      app.instance().setState(initialState);
      props.postData.mockClear();
      props.setToken.mockClear();
    })

    it('should call preventDefault', () => {
      expect(e.preventDefault).toHaveBeenCalledTimes(1);
    })

    it('should call postData', () => {
      expect(props.postData).toHaveBeenCalledWith('login', data);
    })

    it('should call setToken', () => {
      expect(props.setToken).toHaveBeenCalledTimes(1);
    })

    it('should change state', () => {
      expect(app.instance().state).toEqual({
        isAdmin: true,
        authFail: false,
        token: 'testToken',
        isLogging: false
      });
    })
  })
})
