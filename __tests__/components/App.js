import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import App from '../../src';
import Enzyme, { render } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('App', () => {
  it('should render correct', () => {
      const app = render(
        <App/>
      );

      expect(shallowToJson(app)).toMatchSnapshot()
  })
})
