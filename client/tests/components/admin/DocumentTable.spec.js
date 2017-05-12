import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import DocumentTable from
   '../../../src/components/admin/DocumentManager/DocumentTable';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  auth: { isLoggedIn: true, user: { firstName: 'Rowland' } },
  manageDocuments: {
    documents: [1, 2, 3],
    documentDetails: false,
    editMode: false
  }
});


const props = {
  store
};
describe('<DocumentTable />', () => {
  it('should have props a prop called actions', () => {
    const wrapper = shallow(<DocumentTable {...props} />);
    expect(wrapper.props.actions).to.be.defined; // eslint-disable-line
  });
  it('should have props a prop called data', () => {
    const wrapper = shallow(<DocumentTable {...props} />);
    expect(wrapper.props.data).to.be.defined; // eslint-disable-line
  });
  it('should have props a prop called total', () => {
    const wrapper = shallow(<DocumentTable {...props} />);
    expect(wrapper.props.total).to.be.defined; // eslint-disable-line
  });
  it('should have props a prop called offset', () => {
    const wrapper = shallow(<DocumentTable {...props} />);
    expect(wrapper.props.offset).to.be.defined; // eslint-disable-line
  });
  it('should have props a prop called tableHeaders', () => {
    const wrapper = shallow(<DocumentTable {...props} />);
    expect(wrapper.props.tableHeaders).to.be.defined; // eslint-disable-line
  });
});
