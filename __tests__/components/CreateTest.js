import React from 'react';
import { CreateTest } from '../../src/components/CreateTest';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('CreateTest component', () => {
  window.alert = jest.fn();
  const props = {
    postData: jest.fn(() => new Promise((res, rej) => res({ success: true })))
  };
  const initialState = {
    err: false,
    loading: false,
    name: ''
  }
  const component = mount(<CreateTest { ...props }/>);

  it('should render correct', () => {
      expect(shallowToJson(component)).toMatchSnapshot()
  })

  describe('should handle input change', () => {
    beforeAll(() => {
      component.find('#name').simulate('change', {
        target: {
          value: '5',
          id: 'name'
        }
      })
    })

    afterAll(() => {
      component.setState(initialState)
    })

    it('should change state', () => {
      expect(component.state().name).toEqual('5')
    })
  })

  describe('should handle form submit', () => {
    const name = '5';

    beforeAll(() => {
      component.setState({ name }, () => {
        component.find('.formArea form').simulate('submit')
      })
    })

    afterAll(() => {
      component.setState(initialState)
    })

    it('should call postData', () => {
      expect(props.postData).toHaveBeenCalledWith('test', { name })
    })

    it ('should alert success', () => {
      expect(window.alert).toBeCalledWith('Успешно сохранено!')
    })
  })
})
