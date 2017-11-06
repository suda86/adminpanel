import React, { Component } from 'react';
import {connect } from 'react-redux';
import * as actions from '../actions/actions';
import { Link } from 'react-router-dom';
import './style/nav.css';

class Nav extends Component {
  onSignout() {
    this.props.signOut();
  }

  render() {
    return (
      <div className="nav-bar">
        <div className="nav-bar-left">
          <div className="nav-bar-link">
            <Link className="nav-link" to="/">Users</Link>
          </div>
          <div className="nav-bar-link">
            <Link className="nav-link" to="/dashboard/venues">Venues</Link>
          </div>
          <div className="nav-bar-link">
            <Link className="nav-link" to="/dashboard/events">Events</Link>
          </div>
          <div className="nav-bar-link">
            <Link className="nav-link" to="/dashboard/festivals">Festivals</Link>
          </div>
        </div>
        <div className="nav-bar-right">
          <div className="signout">
            <button className="signout-button" onClick={this.onSignout.bind(this)}>Sign out</button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.authenticated
  }
}

export default connect(mapStateToProps, actions)(Nav);
