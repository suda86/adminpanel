import React, { Component } from 'react';
import * as actions from '../actions/actions';
import { connect } from 'react-redux';
import axios from 'axios';
import Map from './Map';
import FormData from 'form-data';
import { Redirect } from 'react-router-dom';
import AddressForm from './Address';
import moment from 'moment';

class NewEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: {
        lng: -79.38318429999998,
        lat: 43.653226
      },
      streetAddress: '',
      fireRedirect: false,
      pictureUrl: undefined
    };
  }

  onFormSubmit(e) {
    e.preventDefault();
    let newEvent = {};
    newEvent.name = this.refs.name.value;
    newEvent.description = this.refs.description.value;
    newEvent.ticket = this.refs.ticket.value;
    newEvent.headerImage = this.state.pictureUrl;
    newEvent.date = this.refs.date.value;
    newEvent.isActive = this.refs.isactive.checked;
    newEvent.isRecurrent = this.refs.isrecurrent.checked;
    newEvent.location = {
      coordinates: [this.state.coordinates.lng, this.state.coordinates.lat]
    };
    newEvent.address = {
      streetAddress: this.state.streetAddress,
      zipCode: this.refs.zipcode.value
    };
    console.log(newEvent);
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if (storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return this.props.signOut();
    }
    axios
      .post(
        `http://46.101.135.245:8010/api/v1/venue/${this.props.match.params
          .id}/event`,
        newEvent,
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        this.setState({
          fireRedirect: true
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  onPictureSelect(e) {
    let file = e.target.files[0];
    let data = new FormData();
    data.append('photo', file);
    console.log(data);
    console.log(file);
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if (storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return this.props.signOut();
    }
    axios
      .post('http://46.101.135.245:8010/api/v1/upload-image', data, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.data.message === 'Successfully uploaded a photo!') {
          console.log('sasa', res.data);
          let picture = res.data.results;
          this.setState({
            pictureUrl: picture
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  onCoordinatesChange(lat, lng) {
    this.setState({
      coordinates: {
        lng,
        lat
      }
    });
  }

  handleAddress(lat, lng, address) {
    this.setState({
      coordinates: {
        lat,
        lng
      },
      streetAddress: address
    });
  }

  render() {
    return (
      <div>
        <h1 className="form-title">New Event</h1>
        <form className="forms" onSubmit={this.onFormSubmit.bind(this)}>
          <label className="form-label">Name: </label>
          <input type="text" ref="name" className="input" placeholder="Name" required />
          <label className="form-label">Date: </label>
          <input 
            type="date" 
            ref="date" 
            min={moment().format('YYYY-MM-DD')}
            className="input" 
            placeholder="Date" 
            required
            />
          <label className="form-label">Street Address: </label>
          <AddressForm
            className="form-label"
            defaultAddress={'Toronto, ON'}
            setLatLng={this.handleAddress.bind(this)}
          />
          <div className="map">
            <div id="map">
              <Map
                lat={this.state.coordinates.lat}
                dragg={true}
                zoom={12}
                lng={this.state.coordinates.lng}
                changeCoordinates={this.onCoordinatesChange.bind(this)}
                containerElement={<div style={{ height: 100 + '%' }} />}
                mapElement={<div style={{ height: 400 + 'px' }} />}
              />
            </div>
          </div>
          <label className="form-label">Zip Code: </label>
          <input
            type="text"
            ref="zipcode"
            className="input"
            placeholder="Zip Code"
          />
          <div className="checkbox-div">
            <label className="checkbox-label">Is Active: </label>
            <input type="checkbox" ref="isactive" className="checkbox-input" />
          </div>
          <div className="checkbox-div">
            <label className="checkbox-label">Is Recurrent: </label>
            <input type="checkbox" ref="isrecurrent" className="checkbox-input" />
          </div>
          <label className="form-label">Header Image: </label>
          <input
            type="file"
            ref="image"
            className="input"
            accept="image/gif, image/jpeg, image/png"
            onChange={this.onPictureSelect.bind(this)}
          />
          <label className="form-label">Ticket Price: </label>
          <input
            type="text"
            ref="ticket"
            className="input"
            placeholder="Ticket Price"
          />
          <label className="form-label">Description: </label>
          <textarea
            ref="description"
            className="textarea-input"
            placeholder="Description"
          />
          <input value="Send" className="submit-button" type="submit" />
        </form>
        {this.state.fireRedirect && (
          <Redirect to={`/dashboard/venue/${this.props.match.params.id}`} />
        )}
      </div>
    );
  }
}

export default connect(null, actions)(NewEvent);
