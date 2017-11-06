import React, { Component } from 'react';
import {connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import './style/dashboard.css';

import Nav from './Nav';
import Users from './Users';
import Events from './Events';
import Venues from './Venues';
import UserProfile from './UserProfile';
import SingleEvent from './SingleEvent';
import SingleVenue from './SingleVenue';
import NewVenue from './NewVenue';
import EditVenue from './EditVenue';
import NewEvent from './NewEvent';
import EditEvent from './EditEvent';
import Festivals from './Festivals';
import SingleFestival from './SingleFestival';
import NewFestival from './NewFestival';
import EditFestival from './EditFestival';

class Dashboard extends Component {
  render() {
    if(!this.props.auth) {
      return <Redirect to="/" />
    }
    return (
      <div className="dashboard-container">
        <div>
          <Nav />
        </div>
        <Switch>
        <Route exact path={this.props.match.url} component={Users} />
        <Route path={this.props.match.url + '/venues' } component={Venues} />
        <Route path={this.props.match.url + '/festivals' } component={Festivals} />
        <Route path={this.props.match.url + '/events/:id' } component={Events} />
        <Route path={this.props.match.url + '/events' } component={Events} />
        <Route path={this.props.match.url + '/user/:id' } component={UserProfile} />
        <Route path={this.props.match.url + '/event/:id' } component={SingleEvent} />
        <Route path={this.props.match.url + '/venue/:id' } component={SingleVenue} />
        <Route path={this.props.match.url + '/festival/:id' } component={SingleFestival} />
        <Route path={this.props.match.url + '/newvenue' } component={NewVenue} />
        <Route path={this.props.match.url + '/newevent/:id' } component={NewEvent} />
        <Route path={this.props.match.url + '/newfestival' } component={NewFestival} />
        <Route path={this.props.match.url + '/editvenue/:id' } component={EditVenue} />
        <Route path={this.props.match.url + '/editfestival/:id' } component={EditFestival} />
        <Route path={this.props.match.url + '/editevent/:id' } component={EditEvent} />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.authenticated
  }
}

export default connect(mapStateToProps)(Dashboard);
