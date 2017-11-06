import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../actions/actions';
import './style/lists.css';

class Users extends Component {
  componentDidMount() {
    this.props.fetchUsers();
  }

  render() {
    function renderUsers() {
      let users = this.props.users;
      return users.map((user, i) => {
        return (
          <tr key={i}>
            <td>{i + 1 + '.'}</td>
            <td>{user.email}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.isActive ? 'Yes' : 'No'}</td>
            <td>
              <Link to={`/dashboard/user/${user._id}`}>View</Link>
            </td>
          </tr>
        );
      });
    }
    return (
      <div>
        <h1 className="list-header">Users List</h1>
        <table>
          <tbody>
            <tr>
              <th>Num</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Is Active</th>
              <th>Action</th>
            </tr>
            {renderUsers.bind(this)()}
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    users: state.users
  };
}

export default connect(mapStateToProps, actions)(Users);
