import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import { Link } from 'react-router-dom';
import './style/lists.css';
import moment from 'moment';

class Events extends Component {
  componentDidMount() {
    this.props.fetchEvents(this.props.match.params.id);
  }

  render() {
    function renderEvents() {
      let events = this.props.events;
      return events.map((event, i) => {
        return (
          <tr key={i}>
            <td>{i + 1 + '.'}</td>
            <td>{event.name}</td>
            <td>{moment(event.date).format('YYYY-MM-DD')}</td>
            <td>{event.isActive ? 'Yes' : 'No'}</td>
            <td>
              <Link to={`/dashboard/event/${event._id}`}>View/Edit</Link>
            </td>
          </tr>
        );
      });
    }
    return (
      <div>
        <h1 className="list-header">Events List</h1>
        <table>
          <tbody>
            <tr>
              <th>Num</th>
              <th>Name</th>
              <th>Date</th>
              <th>Is Active</th>
              <th>Action</th>
            </tr>
            {renderEvents.bind(this)()}
          </tbody>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events
  };
}

export default connect(mapStateToProps, actions)(Events);
