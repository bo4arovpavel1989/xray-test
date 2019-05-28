import React from 'react';
import { MemoryRouter } from 'react-router-dom'
import { History } from '../../src/components/Test/History.js';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('History component', () => {
  const props = {
      testHistory: [{ result: 0 }],
      closeHistory: jest.fn(),
      settings: {},
      prepareCanvas:  jest.fn(),
      drawer: {
        reset: jest.fn(),
        start: jest.fn(),
        clearZones: jest.fn(),
        getZones: jest.fn(() => [[0, 0, 100, 100]]),
        drawOldZones: jest.fn()
      }
  };

  const initialState = {
    testHistory: [{ result: 0 }],
    settings: {},
    answer: { result: 0 },
    currentQuestion: 0,
    canvasBackground: '#canvasBackground',
    canvasDraw: '#canvasDrawArea',
  };

  const component = mount(
    <MemoryRouter initialEntries={[ { key: 'testKey' } ]}>
      <History { ...props }/>
    </MemoryRouter>
  );

  describe('should render correct', () => {
      afterAll(() => {
        props.prepareCanvas.mockClear();
      });

      it('match snapshot', () => {
        expect(shallowToJson(component)).toMatchSnapshot()
      })

      it('should have initial state', () => {
        expect(component.find(History).instance().state).toEqual(initialState)
      })

      it('should call prepareCanvas', () => {
        expect(props.prepareCanvas).toHaveBeenCalledTimes(1);
      })
  })
})
