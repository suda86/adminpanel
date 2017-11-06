import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import axios from 'axios';
import './style/venue.css';
import { Link } from 'react-router-dom';
import Map from './Map';
import moment from 'moment';
import FestivalInfoPopup from './FestivalInfoPopup';

class SingleFestival extends Component {
  constructor(props) {
    super(props);
    this.state = {
      festivalInfo: null,
      active: false,
      currentDay: 0,
      isFestivalInfoPopup: false
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
    axios.get(`http://46.101.135.245:8010/api/v1/festival/${id}`, {
      headers: {
        "Authorization": token
      }
    })
    .then((res) => {
      console.log(res.data.results)
      this.setState({
        festivalInfo: res.data.results,
        active: res.data.results.isActive
      })
    })
    .catch((e) => {
      console.log(e);
      this.props.signOut();
    })
  }
 
  deactivateFestival() {
    let id = this.props.match.params.id;
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if(storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return this.props.signOut();
    }
    axios.patch(`http://46.101.135.245:8010/api/v1/festival/${id}/disable`, null, {
      headers: {
        "Authorization": token
      }
    })
    .then((res) => {
      if(res.data.message === 'Successfully disabled festival') {
        this.setState({
          active: false
        })
      }
    })
    .catch((e) => {
      console.log(e);
    })
  }

  activateFestival() {
    let id = this.props.match.params.id;
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if(storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return this.props.signOut();
    }
    axios.patch(`http://46.101.135.245:8010/api/v1/festival/${id}/enable`, null, {
      headers: {
        "Authorization": token
      }
    })
    .then((res) => {
      if(res.data.message === 'Successfully enabled festival') {
        this.setState({
          active: true
        })
      }
    })
    .catch((e) => {
      console.log(e);
    })
  }

  onSelectDayChange(e) {
    this.setState({
      currentDay: e.target.value
    })
  }

  closeInfoPopup() {
    this.setState({
      isFestivalInfoPopup: false
    })
  }

  showInfoPopup() {
    this.setState({
      isFestivalInfoPopup: true
    })
  }

  render() {
    function renderFestivalInfo() {
      let festivalInfo = this.state.festivalInfo;
      if(festivalInfo) {
        return (
          <div className="venue-container">
            <div className="venue-map">
              <Map
                lat={festivalInfo.location.coordinates[1]}
                dragg={false}
                zoom={15}
                lng={festivalInfo.location.coordinates[0]}
                containerElement={<div style={{ height: 100 + '%' }} />}
                mapElement={<div style={{ height: 220 + 'px' }} />}
              />
            </div>
            <h2 className="venue-name">{festivalInfo.name}</h2>
            <h4 className="event-date" >{moment(this.state.festivalInfo.dateFrom).format('dddd, MMMM Do YYYY')} - {moment(this.state.festivalInfo.dateTo).format('dddd, MMMM Do YYYY')}</h4>
            {festivalInfo.headerImage ? <div className="venue-pictures">
              <img
                className="picture"
                alt="venue pictue"
                src={festivalInfo.headerImage}
              />
            </div> : <p></p>}
            {festivalInfo.description ? <p className="venue-description">{festivalInfo.description}</p> : <p></p>}
            <div className="venue-options">
              <Link to={`/dashboard/editfestival/${this.props.match.params.id}`}>
                <button className="venue-button">Edit Festival</button>
              </Link>
              <button onClick={this.showInfoPopup.bind(this)} className="venue-button">Festival Info</button>
            </div>
            <p className="venue-informations">This is {this.state.active ? 'ACTIVE' : 'NOT ACTIVE'} festival. To change this click on the button under</p>
            {this.state.active ? (
              <button className="venue-popup-button" onClick={this.deactivateFestival.bind(this)}>
                Deactivate!
              </button>
              ) : (
              <button className="venue-popup-button" onClick={this.activateFestival.bind(this)}>
                Activate!
              </button>
            )}
            {this.state.isFestivalInfoPopup && <FestivalInfoPopup closePopup={this.closeInfoPopup.bind(this)} data={this.state.festivalInfo} />}
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
        {renderFestivalInfo.bind(this)()}
      </div>

    )
  }
}

export default connect(null, actions)(SingleFestival);
