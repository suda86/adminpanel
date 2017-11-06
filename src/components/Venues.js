import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../actions/actions';
import './style/lists.css';

class Venues extends Component {
  componentDidMount() {
    this.props.fetchVenues();
  }

  render() {
    function renderVenues() {
      let venues = this.props.venues;
      return venues.map((venue, i) => {
        return (
          <tr key={i}>
            <td>{i + 1 + '.'}</td>
            <td>{venue.name}</td>
            <td>{venue.website}</td>
            <td>{venue.city}</td>
            <td>{venue.phoneNumber}</td>
            <td>
              <Link to={`/dashboard/venue/${venue._id}`}>View/Edit</Link>
            </td>
          </tr>
        );
      });
    }
    return (
      <div>
        <h1 className="list-header">Venues List</h1>
        <h3 className="create-venue" >
          <Link to={`/dashboard/newvenue`}>Create New Venue</Link>
        </h3>
        <table>
          <tbody>
            <tr>
              <th>Num</th>
              <th>Name</th>
              <th>Website</th>
              <th>City</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
            {renderVenues.bind(this)()}
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    venues: state.venues
  };
}

export default connect(mapStateToProps, actions)(Venues);
