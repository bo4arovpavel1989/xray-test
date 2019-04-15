import React from 'react';
import { MemoryRouter } from 'react-router-dom'
import { Test } from '../../src/components/Test';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Test component', () => {
  window.alert = jest.fn();
  window.confirm = jest.fn(() => true)

  const props = {
    getData: jest.fn((arg) => new Promise((res, rej) => {
        if (arg === 'settings') {
          res([{ name: 'test', _id: 'testID', value: 'testValue', description: 'test' }])
        }

        res([{ name: 'test', _id: 'testID' }])
    }))
  };
  const initialState = {
    loading: false,
    testStarted: false,
    testFinished: false,
    user: '',
    settings: { test: 'testValue' },
    tests: [{ _id: 'testID', name: 'test' }],
    currentTest: '',
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
})
