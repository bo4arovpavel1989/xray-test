import React from 'react';
import { MemoryRouter } from 'react-router-dom'
import { Test } from '../../src/components/Test';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Test component', () => {
  const props = {
    getData: jest.fn((arg) => new Promise((res, rej) => {
        if (arg === 'settings') {
          res([{ name: 'test', _id: 'testID', value: 'testValue', description: 'test' }])
        }

        res([{ name: 'test', _id: 'testID' }])
     })),
     drawer: {
       reset: jest.fn(),
       start: jest.fn(),
       clearZones: jest.fn(),
       getZones: jest.fn(() => [[0, 0, 100, 100]])
     },
     prepareCanvas:  jest.fn()
  };
  const initialState = {
    loading: false,
    testStarted: false,
    testFinished: false,
    historyMode: false,
    testHistory: [],
    user: '',
    settings: { test: 'testValue' },
    tests: [{ _id: 'testID', name: 'test' }],
    currentQuestion: -1,
    questions: [],
    total: 100
  };

  const component = mount(
    <MemoryRouter initialEntries={[ { key: 'testKey' } ]}>
      <Test { ...props }/>
    </MemoryRouter>
  );


  describe('component mounted', () => {
    afterAll(() => {
      props.getData.mockClear();
    });

    it('should render correct', () => {
      expect(shallowToJson(component)).toMatchSnapshot()
    })

    it('should call 2 initial getData (tests, settings) functions', () => {
      expect(props.getData).toHaveBeenCalledTimes(2)
    })

    it('should have initial state', () => {
      expect(component.find(Test).instance().state).toEqual(initialState)
    })
  })

  describe('handle userArea submit', () => {
    beforeAll(() => {
      component.find('.userLogin #user').simulate('change', {
        target: {
          value: 'testUser',
          id: 'user' }
        });

      component.find('.userLogin').simulate('submit')
    });

    afterAll(() => {
      props.getData.mockClear();
      component.find(Test).instance().setState(initialState);
    });

    it('should call 2 initial getData (tests, settings) functions', () => {
      expect(props.getData).toHaveBeenCalledWith('questions/test');
    })

    it('should have questions in state', () => {
      expect(component.find(Test).instance().state.questions).toEqual([{ _id: 'testID', name: 'test' }])
    })

    it('should have test-started state', () => {
      expect(component.find(Test).instance().state.testStarted).toEqual(true)
    })

    it('should have currentQuestion state = 0', () => {
      expect(component.find(Test).instance().state.currentQuestion).toEqual(0)
    })

    it('should have user state = testUser', () => {
      expect(component.find(Test).instance().state.user).toEqual('testUser')
    })
  })

  describe('test started', () => {
    beforeAll(() => {
      component.find(Test).instance().setState({
        testStarted: true,
        questions: [{ name: 'name', dimensions: { width: 100, height: 100 } }],
        currentQuestion: 0
       })
    })
    afterAll(() => {
       component.find(Test).instance().setState(initialState);
    });

    it('should render correct', () => {
      expect(shallowToJson(component)).toMatchSnapshot()
    })
  })

  describe('test finished', () => {
    beforeAll(() => {
      component.find(Test).instance().setState({
        testStarted: false,
        testFinished: true,
        settings: { errorThreshold: 80 }
      });
      component.update();
    })

    afterAll(() => {
       component.find(Test).instance().setState(initialState);
    });

    it('should render correct', () => {
      expect(shallowToJson(component)).toMatchSnapshot()
    })

    it('should havel class perfect for 100% result', () => {
        expect(component.find('.resultArea h2 span').hasClass('perfect')).toEqual(true);
    })
  })
})
