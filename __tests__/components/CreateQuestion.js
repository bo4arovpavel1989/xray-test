import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import { CreateQuestion } from '../../src/components/CreateQuestion';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('CreateQuestion component', () => {
  window.alert = jest.fn();

  const props = {
    postFile: jest.fn(() => new Promise((res, rej) => res({ type: 'mockJPG' }))),
    postData: jest.fn(() => new Promise((res, rej) => res({ success: true }))),
    handleFormData: {},
    drawer: {
      reset: jest.fn(),
      start: jest.fn(),
      clearZones: jest.fn(),
      // return mock danger zones
      getZones: jest.fn( () => [[0, 0, 10, 10]] )
    }
  }

  const initialState = {
      canvasDraw: '#canvasDrawArea',
      canvasBackground: '#canvasBackground',
      loading: false,
      err: false,
      imgPath: '',
      dimensions: { width: 0, height: 0 },
      dangerZones: [],
      name: '',
      isDanger: '1'
  };

  const component = mount(
    <CreateQuestion { ...props }/>
  );

  describe('should render correct', () => {
      it('should fit shapshot', () => {
        expect(shallowToJson(component)).toMatchSnapshot()
      })

      it('initialize with initial state', () => {
         expect(component.state()).toEqual(initialState)
      })
  })


  describe('should update state on #name input change', () => {
      beforeEach(() => {
        component.find('input#name').simulate('change', {
          target: {
            value: 'name',
            id: 'name'
          }
        });
      })

      afterEach(() => {
        component.setState(initialState)
      })

      it('should update name', () => {
        expect(component.state().name).toEqual('name')
      });
  })

  describe('should update state on #isDanger input change', () => {
      beforeEach(() => {
        component.find('#isDanger').simulate('change', {
          target: {
            value: '0',
            id: 'isDanger'
          }
        });
      })

      afterEach(() => {
        component.setState(initialState)
      })

      it('should update isDanger', () => {
        expect(component.state().isDanger).toEqual('0')
      })
  })

  describe('should submit images', () => {
      beforeAll(() => {
        component.find('.formArea form').simulate('submit');
      })

      it ('should set state loading true', () => {
        expect(component.state().loading).toEqual(true);
      })

      it ('should call postFile helper function', () => {
        expect(props.postFile).toBeCalledWith('preupload', props.handleFormData)
      })
  })

  describe('should clear canvas on clear button click', () => {
      beforeAll(() => {
        component.find('.danger').simulate('click');
      })

      it ('should call drawer.clearZones', () => {
        expect(props.drawer.clearZones).toHaveBeenCalledTimes(1)
      })
  })

  describe('should perform save question on save button click', () => {
      beforeAll(() => {
        component.setState({ name: 'name' }, () => {
          component.find('.canvasControls .success').simulate('click')
        })
      })

      afterAll(() => {
        component.setState(initialState)
      })

      it ('should set state loading true', () => {
        expect(component.state().loading).toEqual(true);
      })

      it ('should alert success', () => {
        expect(window.alert).toBeCalledWith('Успешно сохранено!')
      })

      it ('should call drawer.getZones', () => {
        expect(props.drawer.getZones).toHaveBeenCalledTimes(1)
      })

      it ('should call postData', () => {
        expect(props.postData).toHaveBeenCalledTimes(1)
      })
  })
})
