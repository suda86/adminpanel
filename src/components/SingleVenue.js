import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import './style/venue.css';
import Map from './Map';
import { Link } from 'react-router-dom';
import axios from 'axios';
import VenueInfoPopup from './VenueInfoPopup';
import WorkingDayPopup from './WorkingDaysPopup';
import WorkingHoursPopup from './WorkingHoursPopup';
import serverUrl from '../serverUrl'
import { getToken } from '../utils'

class SingleVenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      venueInfo: null,
      isVenueInfoPopup: false,
      isWorkingDayPopup: false,
      isWorkingHoursPopup: false,
      day: 1
    };
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    let token = getToken(this.props.signOut)
    axios
      .get(`${serverUrl}venue/${id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          venueInfo: res.data.results,
          active: res.data.results.isActive
        });
      })
      .catch(e => {
        this.props.signOut();
      });
  }

  deactivateVenue() {
    let id = this.props.match.params.id;
    let token = getToken(this.props.signOut)
    axios
      .patch(`${serverUrl}venue/${id}/disable`, null, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.data.message === 'Successfully disabled venue') {
          this.setState({
            active: false
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  activateVenue() {
    let id = this.props.match.params.id;
    let token = getToken(this.props.signOut)
    axios
      .patch(`${serverUrl}venue/${id}/enable`, null, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.data.message === 'Successfully enabled venue') {
          this.setState({
            active: true
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  closeInfoPopup() {
    this.setState({
      isVenueInfoPopup: false
    })
  }

  closeWorkingDayPopup() {
    this.setState({
      isWorkingDayPopup: false
    })
  }

  closeWorkingHoursPopup() {
    this.setState({
      isWorkingHoursPopup: false
    })
  }

  showInfoPopup() {
    this.setState({
      isVenueInfoPopup: true
    })
  }

  showWorkingDayPopup() {
    this.setState({
      isWorkingDayPopup: true
    })
  }

  showWorkingHoursPopup() {
    this.setState({
      isWorkingHoursPopup: true
    })
  }

  renderVenueInfo() {
    let venueInfo = this.state.venueInfo;
    if (venueInfo) {
      return (
        <div className="venue-container">
          <div className="venue-map">
            <Map
              lat={venueInfo.location.coordinates[1]}
              dragg={false}
              zoom={15}
              lng={venueInfo.location.coordinates[0]}
              containerElement={<div style={{ height: 100 + '%' }} />}
              mapElement={<div style={{ height: 220 + 'px' }} />}
            />
          </div>
          <h2 className="venue-name">{venueInfo.name}</h2>
          {venueInfo.headerImage ? <div className="venue-pictures">
            <img
              className="picture"
              alt="venue pictue"
              src={venueInfo.headerImage}
            />
          </div> : <p></p>}
          {venueInfo.description ? <p className="venue-description">{venueInfo.description}</p> : <p></p>}
          <div className="venue-options">
            <Link to={`/dashboard/events/${venueInfo._id}`}>
              <button className="venue-button">All Events</button>
            </Link>
            <Link to={`/dashboard/newevent/${venueInfo._id}`}>
              <button className="venue-button">New Event</button>
            </Link>
            <button onClick={this.showWorkingDayPopup.bind(this)} className="venue-button">This week events</button>
            <Link to={`/dashboard/editvenue/${this.props.match.params.id}`}>
              <button className="venue-button">Edit Venue</button>
            </Link>
            <button onClick={this.showWorkingHoursPopup.bind(this)} className="venue-button">Working Hours</button>
            <button onClick={this.showInfoPopup.bind(this)} className="venue-button">More Info</button>
          </div>
          {this.state.isVenueInfoPopup && <VenueInfoPopup closePopup={this.closeInfoPopup.bind(this)} data={this.state.venueInfo} />}
          {this.state.isWorkingDayPopup && <WorkingDayPopup closePopup={this.closeWorkingDayPopup.bind(this)}  data={this.state.venueInfo.workingDays}/>}
          {this.state.isWorkingHoursPopup && <WorkingHoursPopup closePopup={this.closeWorkingHoursPopup.bind(this)}  data={this.state.venueInfo.workingHours}/>}
          <p className="venue-informations">This is {this.state.active ? 'ACTIVE' : 'NOT ACTIVE'} place. To change this click on the button under</p>
          {this.state.active ? (
            <button className="venue-popup-button" onClick={this.deactivateVenue.bind(this)}>
              Deactivate!
            </button>
            ) : (
            <button className="venue-popup-button" onClick={this.activateVenue.bind(this)}>
              Activate!
            </button>
          )}
          
        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
  }

  render() {
    return (
      <div>
        {this.renderVenueInfo()}
      </div>
    );
  }
}

export default connect(null, actions)(SingleVenue);
