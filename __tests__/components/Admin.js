import React from 'react';
import { MemoryRouter } from 'react-router-dom'
import { Admin } from '../../src/components/Admin';
import Enzyme, { mount } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Admin component', () => {
  window.alert = jest.fn();
  window.confirm = jest.fn(() => true)

  const props = {
    postFile: jest.fn(() => new Promise((res, rej) => res({ success: true }))),
    postData: jest.fn(() => new Promise((res, rej) => res({ success: true }))),
    getData: jest.fn(() => new Promise((res, rej) => res([{ name: 'test', _id: 'testID' }]))),
    deleteData: jest.fn(() => new Promise((res, rej) => res({ success: true }))),
    downloadFile: jest.fn(),
    handleFormData: {}
  };
  const initialState = {
      questions: [{ name: 'test', _id: 'testID' }],
      settings: [{ name: 'test', _id: 'testID' }],
      tests: [{ name: 'test', _id: 'testID' }],
      submitting: false,
      err: false
  };
  const component = mount(
    <MemoryRouter initialEntries={[ { key: 'testKey' } ]}>
      <Admin { ...props }/>
    </MemoryRouter>
  );

  describe('component mounted', () => {
    afterAll(() => {
      props.getData.mockClear();
    });

    it('should render correct', () => {
        expect(shallowToJson(component)).toMatchSnapshot()
    })

    it('should call 3 initial getData (tests, settings, questions) functions', () => {
      expect(props.getData).toHaveBeenCalledTimes(3)
    })

    it('should have initial state', () => {
      expect(component.find(Admin).instance().state).toEqual(initialState)
    })
  })

  describe('it should perform db save', () => {
    beforeAll(() => {
      component.find('.saveDb').simulate('click');
    })

    afterAll(() => {
      component.find(Admin).instance().setState(initialState);
      props.getData.mockClear();
      props.downloadFile.mockClear();
    })

    it('should make get request /savedb', () => {
      expect(props.getData).toHaveBeenCalledWith('savedb')
    })

    it('should call downloadFile 2 time after timeout', (done) => {
      setTimeout(() => {
        expect(props.downloadFile).toHaveBeenCalledTimes(2);
        done();
      }, 150)
    })
  })

  describe('it should perform restore db', () => {
    beforeAll(() => {
      component.find('.loadDb').simulate('submit');
    })

    afterAll(() => {
      component.find(Admin).instance().setState(initialState);
      props.getData.mockClear();
      props.postFile.mockClear();
      window.alert.mockClear();
      window.confirm.mockClear();
    })

    it('should ask confirm', () => {
      expect(window.confirm).toHaveBeenCalledTimes(1);
    })

    it('should call postFile', () => {
      expect(props.postFile).toHaveBeenCalledWith('loaddb', props.handleFormData)
    })

    it('should alert success', () => {
      expect(window.alert).toBeCalledWith('Успешно восстановлено!')
    })

    it('should call 2 getData (getTests and getQuestions) from this.getTestData)', () => {
      expect(props.getData).toHaveBeenCalledTimes(2)
    })
  })

  describe('it should perform refresh test on refresh test button click', () => {
    beforeAll(() => {
      component.find('.oldTest li a').first().simulate('click');
    })

    afterAll(() => {
      component.find(Admin).instance().setState(initialState);
      props.postData.mockClear();
      window.alert.mockClear();
    })

    it('should call postData', () => {
      expect(props.postData).toHaveBeenCalledWith('test', { name: 'test' })
    })

    it('should alert success', () => {
      expect(window.alert).toBeCalledWith('Успешно обновлено!')
    })
  })

  describe('it should perform delete test on delete test button click', () => {
    beforeAll(() => {
      component.find('.oldTest li .danger').simulate('click');
    })

    afterAll(() => {
      component.find(Admin).instance().setState(initialState);
      props.deleteData.mockClear();
      props.getData.mockClear();
      window.confirm.mockClear();
    })

    it('should ask confirm', () => {
      expect(window.confirm).toHaveBeenCalledTimes(1);
    })

    it('should call deleteData', () => {
      expect(props.deleteData).toHaveBeenCalledWith(`deleteobj/Test/test`)
    })

    it('should call 2 getData (getTests and getQuestions) from this.getTestData)', () => {
      expect(props.getData).toHaveBeenCalledTimes(2)
    })
  })
})
