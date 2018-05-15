import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Navbar from '../../../src/components/Nav';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  auth: { isLoggedIn: true,
    user: {
      id: 1,
      firstName: 'Rowland',
      lastName: 'Ekpos',
      roleId: 1
    } },
  manageDocuments: {
    documents: [{
      access: 'public'
    }, {
      access: 'private'
    }, {
      access: 'role'
    }, {
      access: 'public'
    }],
    documentDetails: false,
    editMode: false
  },
  manageSearch: {
    searchList: [1, 2, 3]
  }
});

const props = {
  store
};
const newProps = {
  auth: {
    isLoggedIn: true,
    user: {
      id: 1,
      firstName: 'Rowland',
      lastName: 'Ekpos',
      roleId: 1
    }
  }
};

describe('Navbar', () => {
  let wrapper = shallow(<Navbar {...props} />);
  console.log('nav-props', wrapper.props());
  it('should have a prop called auth', () => {
    expect(wrapper.props.auth).to.be.defined; // eslint-disable-line
  });
  it('should have a logout props', () => {
    expect(wrapper.props.logout).to.be.defined; // eslint-disable-line
  });
  it('should have a logout handler to handle user logout', () => {
    expect(wrapper.logout).to.be.defined; // eslint-disable-line
  });
  it('should render the header component', () => {
    wrapper = mount(
      <MuiThemeProvider >
        <Provider store={store}>
          <Navbar {...newProps} />
        </Provider>
      </MuiThemeProvider>);
    expect(wrapper.find('header')).to.have.length(1); // eslint-disable-line
  });
});
