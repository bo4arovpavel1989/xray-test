import React from 'react';
import { MemoryRouter } from 'react-router-dom'
import { Slide } from '../../src/components/Test/Slide.js';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Slide component', () => {
  const props = {
    settings: {},
    question: {},
    sendResult: jest.fn(),
    nextQuestion: jest.fn(),
    drawer: {
      reset: jest.fn(),
      start: jest.fn(),
      clearZones: jest.fn(),
      getZones: jest.fn(() => [[0, 0, 100, 100]])
    },
    prepareCanvas:  jest.fn()
  };

  const initialState = {
    answered: false,
    canvasBackground: '#canvasBackground',
    canvasDraw: '#canvasDrawArea',
    comment: 'Поздравляем! Правильный ответ.',
    photoShowed: false,
    question: {},
    result: 0,
    settings: {},
    slideShowed: true,
    warningShowed: false
  };

  const component = mount(
    <MemoryRouter initialEntries={[ { key: 'testKey' } ]}>
      <Slide { ...props }/>
    </MemoryRouter>
  );

  describe('should render correct', () => {
      it('match snapshot', () => {
        expect(shallowToJson(component)).toMatchSnapshot()
      })

      it('should have initial state', () => {
        expect(component.find(Slide).instance().state).toEqual(initialState)
      })
  })
})
