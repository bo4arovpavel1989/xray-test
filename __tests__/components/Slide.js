import React from 'react';
import { MemoryRouter } from 'react-router-dom'
import { Slide } from '../../src/components/Test/Slide.js';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { comments } from '../../src/helpers';
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
      getZones: jest.fn(() => [[0, 0, 100, 100]]),
      drawOldZones: jest.fn()
    },
    prepareCanvas:  jest.fn()
  };

  const initialState = {
    answered: false,
    canvasBackground: '#canvasBackground',
    canvasDraw: '#canvasDrawArea',
    comment: comments.right,
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
      afterAll(() => {
        props.prepareCanvas.mockClear();
      });

      it('match snapshot', () => {
        expect(shallowToJson(component)).toMatchSnapshot()
      })

      it('should have initial state', () => {
        expect(component.find(Slide).instance().state).toEqual(initialState)
      })

      it('should call prepareCanvas', () => {
        expect(props.prepareCanvas).toHaveBeenCalledTimes(1);
      })
  })

  describe('should handle question warning timer', () => {
      jest.useFakeTimers();

      beforeAll(() => {
        component.find(Slide).instance().setState({
          settings: {
            timerWarning: 10,
            time: 15,
            redError: 8
          },
          question: {
            dangerZones: [0, 0, 100, 100],
            isDanger: '1'
          }
        });
        component.find(Slide).instance().setQuestionTimers();

        jest.runAllTimers();
      });
      afterAll(() => {
        component.find(Slide).instance().setState(initialState);
        props.drawer.drawOldZones.mockClear();
      });


      it('match snapshot', () => {
        expect(shallowToJson(component)).toMatchSnapshot()
      })

      it('should change state - warningShowed', () => {
        expect(component.find(Slide).instance().state.warningShowed).toEqual(true)
      })
      it('should change state - comment', () => {
        expect(component.find(Slide).instance().state.comment).toEqual(comments.time)
      })
      it('should change state - answered', () => {
        expect(component.find(Slide).instance().state.answered).toEqual(true)
      })
      it('should change state - result', () => {
        expect(component.find(Slide).instance().state.result).toEqual(8)
      })

      it('should call drawZones', () => {
        expect(props.drawer.drawOldZones).toHaveBeenCalledTimes(1)
      })
  })

})
