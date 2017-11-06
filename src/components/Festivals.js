import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../actions/actions';
import './style/lists.css';
import axios from 'axios';
import moment from 'moment';

class Festivals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      festivals: []
    };
  }
  componentDidMount() {
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if (storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return this.props.signOut();
    }
    axios
      .get(`http://46.101.135.245:8010/api/v1/admin/festivals`, {
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

  render() {
    function renderFestivals() {
      let festivals = this.state.festivals;
      console.log(festivals);
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
            {renderFestivals.bind(this)()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(null, actions)(Festivals);
