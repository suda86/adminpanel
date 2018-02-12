import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils';
import serverUrl from '../serverUrl';
import * as actions from '../actions/actions';
import './style/lists.css';

class Venues extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: ''
    }
  }
  componentDidMount() {
    this.props.fetchVenues();
  }

  renderVenues() {
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

  onFileSelect(e) {
    let file = e.target.files[0];
    let data = new FormData();
    data.append('venueFile', file);
    let token = getToken(this.props.signOut)
    axios
      .post(`${serverUrl}venue/import`, data, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.data.message === 'Venues imported successfully') {
          this.props.fetchVenues();
          this.setState({
            message: 'successiful'
          });
          setTimeout(() => {
            this.setState({message: ''})
          }, 4000)
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    return (
      <div>
        <h1 className="list-header">Venues List</h1>
        <label htmlFor="csv">Import csv file: </label>
        <input name="csv" type="file" accept=".csv" onChange={this.onFileSelect.bind(this)}/>
        <p>{this.state.message}</p>
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
            {this.renderVenues()}
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
