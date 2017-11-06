import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import axios from 'axios';
import './style/venue.css';
import { Link } from 'react-router-dom';
import Map from './Map';
import EventInfoPopup from './EventInfoPopup';
import moment from 'moment';

class SingleEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventInfo: null,
      active: false,
      isEventInfoPopup: false
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
    axios.get(`http://46.101.135.245:8010/api/v1/event/${id}`, {
      headers: {
        "Authorization": token
      }
    })
    .then((res) => {
      this.setState({
        eventInfo: res.data.results,
        active: res.data.results.isActive
      })
    })
    .catch((e) => {
      console.log(e);
      this.props.signOut();
    })
  }

  deactivateEvent() {
    let id = this.props.match.params.id;
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if(storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return this.props.signOut();
    }
    axios.patch(`http://46.101.135.245:8010/api/v1/event/${id}/disable`, null, {
      headers: {
        "Authorization": token
      }
    })
    .then((res) => {
      if(res.data.message === 'Successfully disabled event') {
        this.setState({
          active: false
        })
      }
    })
    .catch((e) => {
      console.log(e);
    })
  }

  activateEvent() {
    let id = this.props.match.params.id;
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if(storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return this.props.signOut();
    }
    axios.patch(`http://46.101.135.245:8010/api/v1/event/${id}/enable`, null, {
      headers: {
        "Authorization": token
      }
    })
    .then((res) => {
      if(res.data.message === 'Successfully enabled event') {
        this.setState({
          active: true
        })
      }
    })
    .catch((e) => {
      console.log(e);
    })
  }

  closeInfoPopup() {
    this.setState({
      isEventInfoPopup: false
    })
  }

  showInfoPopup() {
    this.setState({
      isEventInfoPopup: true
    })
  }

  render() {
    function renderEventInfo() {
      let eventInfo = this.state.eventInfo;
      if(eventInfo) {
        return (
          <div className="venue-container">
            <h2 className="venue-name">{eventInfo.name}</h2>
            <h4 className="event-date" >{moment(eventInfo.date).format('dddd, MMMM Do YYYY')}</h4>
            {eventInfo.headerImage ? <div className="venue-pictures">
              <img
                className="picture"
                alt="event pic"
                src={eventInfo.headerImage}
              />
            </div> : <p></p>}
            {eventInfo.description ? <p className="venue-description">{eventInfo.description}</p> : <p></p>}
            <div className="venue-options">
              <Link to={`/dashboard/venue/${eventInfo.venue}`}>
                <button className="venue-button">See Venue</button>
              </Link>
              <Link to={`/dashboard/editevent/${this.props.match.params.id}`}>
                <button className="venue-button">Edit Event</button>
              </Link>
              <button onClick={this.showInfoPopup.bind(this)} className="venue-button">More Info</button>
            </div>
            <p className="venue-informations">This is {this.state.active ? 'ACTIVE' : 'NOT ACTIVE'} event. To change this click on the button under</p>
            {this.state.active ? (
              <button className="venue-popup-button" onClick={this.deactivateEvent.bind(this)}>
                Deactivate!
              </button>
              ) : (
              <button className="venue-popup-button" onClick={this.activateEvent.bind(this)}>
                Activate!
              </button>
            )}
            <div className="venue-map">
              <Map
                lat={eventInfo.location.coordinates[1]}
                dragg={false}
                zoom={15}
                lng={eventInfo.location.coordinates[0]}
                containerElement={<div style={{ height: 100 + '%' }} />}
                mapElement={<div style={{ height: 220 + 'px' }} />}
              />
            </div>
            {this.state.isEventInfoPopup && <EventInfoPopup closePopup={this.closeInfoPopup.bind(this)} data={this.state.eventInfo} />}
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
        {renderEventInfo.bind(this)()}
      </div>

    )
  }
}

export default connect(null, actions)(SingleEvent);
