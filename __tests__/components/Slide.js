import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import Slide from '../../src/components/Test/Slide.js';
import Enzyme, { render } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Slide component', () => {
  const props = {
    settings: {},
    question: {},
    sendResult: jest.fn(),
    nextQuestion: jest.fn()
  }


  it('should render correct', () => {
      const component = render(
        <BrowserRouter>
          <Slide { ...props }/>
        </BrowserRouter>
      );

      expect(shallowToJson(component)).toMatchSnapshot()
  })
})
