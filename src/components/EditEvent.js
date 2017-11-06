import React, { Component } from 'react';
import './style/form.css';
import axios from 'axios';
import Map from './Map';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import AddressForm from './Address';
import moment from 'moment';

class EditEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: {
        lng: -79.39722,
        lat: 43.648198
      },
      fireRedirect: false,
      isActive: false,
      isLoaded: false,
      name: '',
      date: null,
      streetAddress: 'Toronto, ON',
      zipCode: '',
      ticket: '',
      description: '',
      isRecurrent: false,
      pictureUrl: undefined
    };
  }

  componentDidMount() {
    let id = this.props.match.params.id;
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if (storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return this.props.signOut();
    }
    axios
      .get(`http://46.101.135.245:8010/api/v1/event/${id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        this.setState({
          coordinates: {
            lng: res.data.results.location.coordinates[0],
            lat: res.data.results.location.coordinates[1]
          },
          venueId: res.data.results.venue,
          name: res.data.results.name,
          streetAddress: res.data.results.address
            ? res.data.results.address.streetAddress
            : 'Toronto, ON',
          zipCode: res.data.results.address
            ? res.data.results.address.zipCode
            : undefined,
          ticket: res.data.results.ticket,
          isActive: res.data.results.isActive,
          isRecurrent: res.data.results.isRecurrent,
          date: res.data.results.date,
          description: res.data.results.description,
          isLoaded: true,
          pictureUrl: res.data.results.headerImage
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

  onFormSubmit(e) {
    e.preventDefault();
    let newEvent = {};
    newEvent.name = this.state.name;
    newEvent.description = this.state.description;
    newEvent.date = this.state.date;
    newEvent.address = {
      streetAddress: this.state.streetAddress,
      zipCode: this.state.zipCode
    };
    newEvent.ticket = this.state.ticket;
    newEvent.isActive = this.state.isActive;
    newEvent.isRecurrent = this.state.isRecurrent;
    newEvent.location = {
      coordinates: [this.state.coordinates.lng, this.state.coordinates.lat]
    };
    newEvent.headerImage = this.state.pictureUrl
    console.log(newEvent);
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if (storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return this.props.signOut();
    }
    axios
      .put(
        `http://46.101.135.245:8010/api/v1/venue/${this.state
          .venueId}/event/${this.props.match.params.id}`,
        newEvent,
        {
          headers: {
            Authorization: token
          }
        }
      )
      .then(res => {
        console.log(res.data);
        this.setState({
          fireRedirect: true
        });
      })
      .catch(e => {
        console.log(e);
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
    console.log(this.state.date ? this.state.date.slice(0, 10) : 'nula');
    function renderForm() {
      let loaded = this.state.isLoaded;
      if (loaded) {
        return (
          <div>
            <h1 className="form-title">Edit Event</h1>
            <form className="forms" onSubmit={this.onFormSubmit.bind(this)}>
              <label className="form-label">Name: </label>
              <input
                type="text"
                ref="name"
                className="input"
                placeholder="Name"
                value={this.state.name}
                onChange={e => this.setState({ name: e.target.value })}
                required
              />
              <label className="form-label">Date: </label>
              <input
                type="date"
                ref="date"
                className="input"
                min={moment().format('YYYY-MM-DD')}
                value={this.state.date.slice(0, 10)}
                onChange={e => this.setState({ date: e.target.value })}
                required
              />
              <label className="form-label">Street Address: </label>
              <AddressForm
                className="form-label"
                defaultAddress={this.state.streetAddress}
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
                value={this.state.zipCode}
                onChange={e => this.setState({ zipCode: e.target.value })}
              />
              <div className="checkbox-div">
                <label className="checkbox-label">Is Active: </label>
                <input
                  type="checkbox"
                  ref="isactive"
                  className="checkbox-input"
                  checked={this.state.isActive}
                  onChange={e => this.setState({ isActive: e.target.checked })}
                />
              </div>
              <div className="checkbox-div">
                <label className="checkbox-label">Is Recurrent: </label>
                <input
                  type="checkbox"
                  ref="isrecurrent"
                  className="checkbox-input"
                  checked={this.state.isRecurrent}
                  onChange={e => this.setState({ isRecurrent: e.target.checked })}
                />
              </div>
              <label className="form-label">Header Image: </label>
              <input
                type="file"
                ref="image"
                className="input"
                accept="image/gif, image/jpeg, image/png"
                onChange={this.onPictureSelect.bind(this)}
              />
              <label className="form-label">Ticket: </label>
              <input
                type="text"
                ref="ticket"
                className="input"
                placeholder="Ticket Price"
                value={this.state.ticket}
                onChange={e => this.setState({ ticket: e.target.value })}
              />
              <label className="form-label">Description: </label>
              <textarea
                ref="description"
                className="input"
                placeholder="Description"
                value={this.state.description}
                onChange={e => this.setState({ description: e.target.value })}
              />
              <input className="submit-button" type="submit" />
            </form>
            {this.state.fireRedirect && (
              <Redirect to={`/dashboard/event/${this.props.match.params.id}`} />
            )}
          </div>
        );
      } else {
        return <div>loading...</div>;
      }
    }
    return <div>{renderForm.bind(this)()}</div>;
  }
}

export default connect(null, actions)(EditEvent);
