import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import { CreateQuestion } from '../../src/components/CreateQuestion';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('CreateQuestion component', () => {
  const props = {
    drawer: {
      reset: jest.fn(),
      start: jest.fn(),
      clearZones: jest.fn(),
      getZones: jest.fn()
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

      it('should update isDanger', () => {
        expect(component.state().isDanger).toEqual('0')
      })
  })

  describe('should submit images', () => {
      window.postFile = jest.fn();
      component.handleFormData = jest.fn();
      component.find('.formArea form').simulate('submit');

      it ('should set state loading true', () => {
        expect(component.state().loading).toEqual(true);
      })

      it ('should handle form data', () => {
        expect(component.handleFormData).toHaveBeenCalledTimes(1)
      })

      it ('should call postFile helper function', () => {
        expect(window.postFile).toHaveBeenCalledTimes(1)
      })
  })
})
