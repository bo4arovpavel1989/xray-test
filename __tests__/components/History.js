import React from 'react';
import { MemoryRouter } from 'react-router-dom'
import { History } from '../../src/components/Test/History.js';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('History component', () => {
  const props = {
      testHistory: [{ result: 0 }, { result: 4 }, { result: 8 }],
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
    testHistory: props.testHistory,
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

  describe('should close on close-button click', () => {
      beforeAll(() => {
        component.find('.closeButton').simulate('click');
      })

      afterAll(() => {
        props.closeHistory.mockClear();
        component.find(History).instance().setState(initialState);
      });

      it('should call closeHistory prop function', () => {
        expect(props.closeHistory).toHaveBeenCalledTimes(1)
      })
  })

  describe('should show next slide', () => {
      beforeAll(() => {
        component.find('.next.nav').simulate('click')
      })

      afterAll(() => {
        component.find(History).instance().setState(initialState);
        props.prepareCanvas.mockClear();
      });

      it('should change state', () => {
          expect(component.find(History).instance().state.answer).toEqual({ result: 4 })
          expect(component.find(History).instance().state.currentQuestion).toEqual(1)
      })

      it('should call prepareCanvas', () => {
        expect(props.prepareCanvas).toHaveBeenCalledTimes(1);
      })
  })

  describe('should show prev slide', () => {
      beforeAll(() => {
        component.find(History).instance().setState({
          currentQuestion: 1
        }, () => {
          component.find('.prev.nav').simulate('click')
        })
      })

      afterAll(() => {
        component.find(History).instance().setState(initialState);
        props.prepareCanvas.mockClear();
      });

      it('should change state', () => {
          expect(component.find(History).instance().state.answer).toEqual({ result: 0 })
          expect(component.find(History).instance().state.currentQuestion).toEqual(0)
      })

      it('should call prepareCanvas', () => {
        expect(props.prepareCanvas).toHaveBeenCalledTimes(1);
      })
  })

  describe('should not show next slide', () => {
      beforeAll(() => {
        component.find(History).instance().setState({
          currentQuestion: 2
        }, () => {
          component.find('.next.nav').simulate('click')
        })
      })

      afterAll(() => {
        component.find(History).instance().setState(initialState);
        props.prepareCanvas.mockClear();
      });

      it('should change state', () => {
          expect(component.find(History).instance().state.currentQuestion).toEqual(2)
      })

      it('should call prepareCanvas', () => {
        expect(props.prepareCanvas).toHaveBeenCalledTimes(0);
      })
  })

  describe('should not show prev slide', () => {
      beforeAll(() => {
        component.find('.prev.nav').simulate('click')
      })

      afterAll(() => {
        component.find(History).instance().setState(initialState);
        props.prepareCanvas.mockClear();
      });

      it('should change state', () => {
          expect(component.find(History).instance().state.currentQuestion).toEqual(0)
      })

      it('should call prepareCanvas', () => {
        expect(props.prepareCanvas).toHaveBeenCalledTimes(0);
      })
  })

})
