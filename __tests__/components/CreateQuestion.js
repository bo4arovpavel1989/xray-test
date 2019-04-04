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


  describe('should update state on input change', () => {
    //  component.setState(initialState)
      beforeEach(() => {
        component.find('input#name').simulate('change', {
          currentTarget: {
            value: 'name'
          }
        });

        component.find('#isDanger').simulate('change', {
          currentTarget: {
            value: '1'
          }
        });
      })

      it('should update name', () => {
        expect(component.state().name).toEqual('name')
      });

      it('should update isDanger', () => {
        expect(component.state().isDanger).toEqual('1')
      })
  })
/*
  it('should submit images', () => {
      const component = mount(
        <BrowserRouter>
          <CreateQuestion { ...props }/>
        </BrowserRouter>
      );
      component.handleFormData = jest.fn();
      component.find('.formArea form').simulate('submit');
      expect(component.state().loading).toEqual(true);
  })*/
})
