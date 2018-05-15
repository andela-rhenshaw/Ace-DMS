import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Modal, Button } from 'react-materialize';
import toastr from 'toastr';
import { bindActionCreators } from 'redux';
import Nav from '../Nav'; //eslint-disable-line
import * as userActions from '../../actions/userActions';


/**
 * @class DocManager
 * @extends {React.Component}
 */
class Profile extends React.Component {
  /**
   * Creates an instance of Profile.
   * @param {Object} props
   * @memberof Profile
   */
  constructor(props) {
    super(props);
    const currentMode = this.props.viewMode || false;
    this.state = !currentMode ?
    {
      user: {}
    } :
    {
      user: this.props.user,
      fullUser: {}
    };
    this.updateFullProfile = this.updateFullProfile.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateFirstName = this.updateFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
  }
    /**
   * Function that watches for change in input field values
   * @param {Object} e - onClick event
   * @returns {none} none
   * @memberOf Dashboard
   */
  onChange(e) {
    const field = e.target.name;
    const user = this.state.user;
    user[field] = e.target.value;
    this.setState({ user });
  }
  /**
   * Function to validate password
   * @returns {Boolean} validation status
   * @memberof Profile
   */
  validatePassword() {
    const { password, confirmPassword } = this.state.user;
    return password === confirmPassword && password.trim() !== '';
  }
    /**
   * Function to validate full profile form data
   * @returns {Boolean} validation status
   * @memberof Profile
   */
  validateForm() {
    const { user } = this.state;
    if (!user.firstName) {
      return false;
    } else if (!user.lastName) {
      return false;
    }
    return true;
  }
    /**
   * Function to handle updates on full user profiles
   * @param {Object} e - onClick event
   * @returns {String} update status
   * @memberof Profile
   */
  updateFullProfile(e) {
    e.preventDefault();
    const isValidDetails = this.validateForm();
    if (isValidDetails) {
      const status = this.validatePassword();
      if (status) {
        const id = this.props.auth.user.id;
        const user = {
          password: this.state.user.password,
          firstName: this.state.user.firstName,
          lastName: this.state.user.lastName
        };
        this.props.actions.editUser(user, id)
      .then(() => {
        toastr.success('Profile updated Succesfully');
        this.setState({ user: {} });
      }).catch(() => {
        toastr.error('Invalid details provided!');
        this.setState({ user: {} });
      });
      } else {
        toastr.error('Invalid Operation! passwords not a match');
      }
    } else {
      toastr.error('Invalid Form Data!');
      this.setState({ user: {} });
    }
  }
  /**
   * Function to hnadle password updates
   * @param {Object} e - onClick event
   * @returns {String} update status
   * @memberof Profile
   */
  updatePassword(e) {
    e.preventDefault();
    const status = this.validatePassword();
    if (status) {
      const id = this.props.auth.user.id;
      const user = {
        password: this.state.user.password
      };
      this.props.actions.editUser(user, id)
      .then(() => {
        toastr.success('Password updated succesfully');
      })
      .catch(() => {
        toastr.error('Password length should range between 6 - 100 characters');
      });
    } else {
      toastr.error('Invalid Operation! passwords not a match');
    }
  }
    /**
   * Function to hnadle firstName updates
   * @param {Object} e - onClick event
   * @returns {String} update status
   * @memberof Profile
   */
  updateFirstName(e) {
    e.preventDefault();
    if (this.state.user.firstName === undefined) {
      toastr.error('Please Enter a valid name');
    } else {
      const status = (this.state.user.firstName).trim() !== '';
      if (status) {
        const id = this.props.auth.user.id;
        const user = {
          firstName: this.state.user.firstName
        };
        this.props.actions.editUser(user, id)
      .then(() => {
        toastr.success('Name updated succesfully');
      });
      } else {
        toastr.error('Please Enter a valid name');
      }
    }
  }
    /**
   * Function to hnadle lastName updates
   * @param {Object} e - onClick event
   * @returns {String} update status
   * @memberof Profile
   */
  updateLastName(e) {
    e.preventDefault();
    if (this.state.user.lastName === undefined) {
      toastr.error('Please Enter a valid name');
    } else {
      const status = (this.state.user.lastName).trim() !== '';
      if (status) {
        const id = this.props.auth.user.id;
        const user = {
          lastName: this.state.user.lastName
        };
        this.props.actions.editUser(user, id)
      .then(() => {
        toastr.success('Last name updated succesfully');
      });
      } else {
        toastr.error('Please Enter a valid name');
      }
    }
  }
  /**
   * Render function that renders the profile page for users
   * @returns {Object} Jsx Object
   * @memberof Profile
   */
  render() {
    const { email, firstName, lastName, roleId } = this.props.user;
    const { viewMode } = this.props;
    return (
      <div>
        <Nav auth={this.props.auth} />
        <div>
          <Row>
            <Col m={2}>
              <div className="card profile-card">
                <i className="fa fa-user profile" />
              </div>
            </Col>
            <Col m={10}>
              <Col className="s7 push-s3" >
                <div className="card">
                  {viewMode ?
                    <h4 className="user-header">User Profile</h4>
                      : <h4 className="user-header">General Account Settings</h4>
                   }

                  <div className="divider" />
                  <div className="user-header">
                    <table>
                      <tr>
                        <th>E-mail</th>
                        <th>{email}</th>
                        <th />
                      </tr>
                      <tr>
                        <th>Type</th>
                        <th>{roleId === 1 ? 'ADMIN' : 'REGULAR USER'}</th>
                        <th><i
                          className="material-icons verified"
                        >verified_user</i></th>
                      </tr>
                      <tr>
                        <th>First Name</th>
                        <th>{firstName.toUpperCase()}</th>
                        {viewMode ? '' :
                        <th>
                          <Modal
                            actions={
                            [
                              <Button
                                style={{ marginLeft: `${2}em` }}
                                className="btn-save"
                                waves="light"
                                modal="close"
                                flat
                              >Close
                                    </Button>,
                              <Button
                                id="sav"
                                waves="light"
                                modal="close"
                                flat
                                className="btn-save"
                                onClick={this.updateFirstName}
                              >Save
                                    </Button>
                            ]
                            }
                            trigger={
                              <button
                                className="fa fa-pencil card-actions"
                                data-tooltip="Edit First Name"
                              />}
                          >
                            <Row>
                              <div className="col s8 push-s2">
                                <h4
                                  className="user-header"
                                >UPDATE First Name</h4>
                                <div>
                                  <label
                                    htmlFor="current"
                                  >Current First Name</label>
                                  <h4 id="current">{firstName.toUpperCase()}</h4>
                                </div>
                                <div>
                                  <label htmlFor="new">New First Name</label>
                                  <input
                                    id="firstName"
                                    type="text"
                                    icon="person_otline"
                                    onChange={this.onChange}
                                    name="firstName"
                                    value={this.state.user.firstName}
                                  />
                                </div>
                              </div>
                            </Row>
                          </Modal>
                        </th>
                        }
                      </tr>
                      <tr className="clear" />
                      <tr>
                        <th>Last Name</th>
                        <th>{lastName.toUpperCase()}</th>
                        {viewMode ? '' :
                        <th>
                          <Modal
                            body=""
                            actions={
                            [
                              <Button
                                style={{ marginLeft: `${2}em` }}
                                className="btn-save"
                                waves="light"
                                modal="close"
                                flat
                              >Close
                                    </Button>,
                              <Button
                                waves="light"
                                flat
                                className="btn-save"
                                modal="close"
                                onClick={this.updateLastName}
                              >Save
                                    </Button>
                            ]
                                }
                            trigger={
                              <button
                                className="fa fa-pencil card-actions"
                                data-tooltip="Edit Last Name"
                              />}
                          >
                            <Row>
                              <div className="col s8 push-s2">
                                <h4 className="user-header">UPDATE Last Name</h4>
                                <div>
                                  <label
                                    htmlFor="current"
                                  >Current First Name</label>
                                  <h4 id="current">{lastName.toUpperCase()}</h4>
                                </div>
                                <div>
                                  <label htmlFor="new">New Last Name</label>
                                  <input
                                    id="lastName"
                                    type="text"
                                    icon="person_otline"
                                    onChange={this.onChange}
                                    name="lastName"
                                    value={this.state.user.lastName}
                                  />
                                </div>
                              </div>
                            </Row>
                          </Modal>
                        </th>
                        }
                      </tr>
                      <tr className="clear" />
                      {viewMode ? '' :
                      <tr>
                        <th>Password</th>
                        <th>*******</th>
                        <th>
                          <Modal
                            body=""
                            actions={
                            [
                              <Button
                                style={{ marginLeft: `${2}em` }}
                                className="btn-save"
                                waves="light"
                                modal="close"
                                flat
                              >Close
                                      </Button>,
                              <Button
                                waves="light"
                                flat className="btn-save"
                                onClick={this.updatePassword}
                                modal="close"
                              >Save
                                      </Button>
                            ]
                                    }
                            trigger={
                              <button
                                className="fa fa-pencil card-actions"
                                data-tooltip="Edit Password"
                              />}
                          >
                            <Row>
                              <div className="col s8 push-s2">
                                <h4 className="user-header">UPDATE PASSWORD</h4>
                                <div>
                                  <label
                                    htmlFor="current"
                                  >Current Password</label>
                                  <input id="current" type="password" />
                                </div>
                                <div>
                                  <label htmlFor="new">New Password</label>
                                  <input
                                    id="password"
                                    type="password"
                                    onChange={this.onChange}
                                    name="password"
                                    value={this.state.user.password}
                                    icon="lock"
                                  />
                                </div>
                                <div>
                                  <label
                                    htmlFor="comfirm"
                                  >Comfirm New Password</label>
                                  <input
                                    id="comfirm-password"
                                    type="password"
                                    onChange={this.onChange}
                                    name="confirmPassword"
                                    value={this.state.user.confirmPassword}
                                    icon="lock"
                                  />
                                </div>
                              </div>
                            </Row>
                          </Modal>
                        </th>
                      </tr>
                      }
                      <tr className="clear" />
                    </table>
                  </div>
                  <div className="clear" />
                  <div className="clear" />
                  {!viewMode ?
                    <Row>
                      <Col m={4} />
                      <Col m={4} >
                        <Modal
                          actions={
                          [
                            <Button
                              style={{ marginLeft: `${2}em` }}
                              className="btn-save"
                              waves="light"
                              modal="close"
                              flat
                            >Close
                                    </Button>,
                            <Button
                              id="sav"
                              waves="light"
                              flat
                              className="btn-save"
                              onClick={this.updateFullProfile}
                            >Save
                                    </Button>
                          ]
                            }
                          trigger={
                            <Button
                              id="full-edit"
                              type="submit"
                              value="Sign In"
                            >EDIT FULL PROFILE
                         </Button>}
                        >
                          <Row>
                            <div className="col s8 push-s2">
                              <h4 className="user-header">UPDATE PROFILE</h4>
                              <div>
                                <label htmlFor="new">First Name</label>
                                <input
                                  id="fFirstName"
                                  type="text"
                                  placeholder={firstName}
                                  icon="person_otline"
                                  onChange={this.onChange}
                                  name="firstName"
                                  required
                                />
                                <label htmlFor="new">Last Name</label>
                                <input
                                  id="fLastName"
                                  type="text"
                                  placeholder={lastName}
                                  icon="person_otline"
                                  onChange={this.onChange}
                                  name="lastName"
                                  required
                                />
                                <label htmlFor="new">Password</label>
                                <input
                                  id="lastName"
                                  type="password"
                                  icon="person_otline"
                                  onChange={this.onChange}
                                  name="password"
                                  required
                                />
                                <label htmlFor="new">Comfirm Password</label>
                                <input
                                  id="lastName"
                                  type="password"
                                  icon="person_otline"
                                  onChange={this.onChange}
                                  name="confirmPassword"
                                  required
                                />
                              </div>
                            </div>
                          </Row>
                        </Modal>
                      </Col>
                      <Col m={4} />
                    </Row> : ''
                  }
                </div>
                <div className="clear" />
              </Col>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
Profile.propTypes = {
  user: React.PropTypes.object.isRequired,
  auth: React.PropTypes.object.isRequired,
  actions: React.PropTypes.func.isRequired,
  viewMode: React.PropTypes.bool.isRequired
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(userActions, dispatch)
});

const mapStateToProps = (state) => {
  const { viewMode } = state.manageUsers;
  if (viewMode) {
    return {
      auth: state.auth,
      user: state.manageUsers.selectedUser,
      viewMode: state.manageUsers.viewMode
    };
  }
  return {
    auth: state.auth,
    user: state.auth.user,
    viewMode
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
