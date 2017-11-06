import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import './style/user.css';
import axios from 'axios';

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userInfo: null,
      active: false
    }
  }
  componentDidMount() {
    let id = this.props.match.params.id;
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if(storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return this.props.signOut();
    }
    axios.get(`http://46.101.135.245:8010/api/v1/user/${id}`, {
      headers: {
        "Authorization": token
      }
    })
    .then((res) => {
      this.setState({
        userInfo: res.data.results,
        active: res.data.results.isActive
      });
    })
    .catch((e) => {
      console.log(e);
      this.props.signOut();
    })
  }

  disableUser() {
    let id = this.props.match.params.id;
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if(storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return this.props.signOut();
    }
    axios.patch(`http://46.101.135.245:8010/api/v1/user/${id}/disable`, null, {
      headers: {
        "Authorization": token
      }
    })
    .then((res) => {
      if(res.data.message === 'User successfully disabled') {
        this.setState({
          active: false
        })
      } else {
        console.log('greska');
      }
    })
    .catch((e) => {
      console.log(e);
    })
  }

  enableUser() {
    let id = this.props.match.params.id;
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if(storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return this.props.signOut();
    }
    axios.patch(`http://46.101.135.245:8010/api/v1/user/${id}/enable`,null,  {
      headers: {
        "Authorization": token
      }
    })
    .then((res) => {
      if(res.data.message === 'User successfully enabled') {
        this.setState({
          active: true
        })
      }  else {
        console.log('greska');
      }
    })
    .catch((e) => {
      console.log(e);
    })
  }

  render() {
    function renderUserInfo() {
      let userInfo = this.state.userInfo;
      console.log(userInfo);
      if(userInfo) {
        return (
          <div className="user-profile-container">
            <h2 className="user-name">{userInfo.firstName} {userInfo.lastName}</h2>
            <p className="user-email">{userInfo.email}</p>
            <img className="user-image" src="http://www.teejr.com/wp-content/uploads/2015/06/no-photo-availiable.jpg" alt="user" />
            <p className="user-is-active" >{userInfo.firstName} is {this.state.active ? 'Active' : 'Not Active'} user</p>
            {this.state.active ? 
            <button 
              className="user-activate-deactivate-button" 
              onClick={this.disableUser.bind(this)}>
                Disable User
            </button> : 
            <button 
              className="user-activate-deactivate-button"
              onClick={this.enableUser.bind(this)}>
                Activate User!
            </button>}
          </div>
        )
      } else {
        return (
          <div>
            Loading...
          </div>
        )
      }
    }
    return (
      <div>
        {renderUserInfo.bind(this)()}
      </div>

    )
  }
}


export default connect(null, actions)(UserProfile)
