import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../actions/actions';
import './style/lists.css';
import axios from 'axios';
import moment from 'moment';
import serverUrl from '../serverUrl'
import { getToken } from '../utils'

class Festivals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      festivals: []
    };
  }
  componentDidMount() {
    let token = getToken(this.props.signOut)
    axios
      .get(`${serverUrl}admin/festivals`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          festivals: res.data.results
        });
      })
      .catch(e => {
        console.log(e);
        this.props.signOut();
      });
  }

  renderFestivals() {
    let festivals = this.state.festivals;
    return festivals.map((festival, i) => {
      return (
        <tr key={i}>
          <td>{i + 1 + '.'}</td>
          <td>{festival.name}</td>
          <td>{moment(festival.dateFrom).format('YYYY-MM-DD')}</td>
          <td>{moment(festival.dateTo).format('YYYY-MM-DD')}</td>
          <td>{festival.isActive ? 'Yes' : 'No'}</td>
          <td>
            <Link to={`/dashboard/festival/${festival._id}`}>View/Edit</Link>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div>
        <h1 className="list-header">All Festivals</h1>
        <h3 className="create-venue" >
          <Link to={`/dashboard/newfestival`}>Create New Festival</Link>
        </h3>
        <table>
          <tbody>
            <tr>
              <th>Num</th>
              <th>Name</th>
              <th>From</th>
              <th>To</th>
              <th>Is Active</th>
              <th>Action</th>
            </tr>
            {this.renderFestivals()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(null, actions)(Festivals);
