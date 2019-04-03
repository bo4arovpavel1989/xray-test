import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import CreateQuestion from '../../src/components/CreateQuestion';
import Enzyme, { render } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('CreateQuestion component', () => {
  it('should render correct', () => {
      const component = render(
        <BrowserRouter>
          <CreateQuestion/>
        </BrowserRouter>
      );

      expect(shallowToJson(component)).toMatchSnapshot()
  })
})
