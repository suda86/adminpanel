import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';
import FormData from 'form-data';
import AddressForm from './Address';
import WorkingHours from './WorkingHours';
import serverUrl from '../serverUrl'
import './style/form.css';
import Map from './Map';
import { getToken, genres } from '../utils'

class NewVenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: {
        lng: -79.383184299999985,
        lat: 43.653226
      },
      address: '',
      fireRedirect: false,
      genres: [],
      workingHours: [
        {day: 'Monday', from: 21, to: 4},
        {day: 'Tuesday', from: 21, to: 4},
        {day: 'Wednesday', from: 21, to: 4},
        {day: 'Thursday', from: 21, to: 4},
        {day: 'Friday', from: 21, to: 4},
        {day: 'Saturday', from: 21, to: 4},
        {day: 'Sunday', from: 21, to: 4}
      ],
      showGenres: false,
      showWorkingHours: false,
      pictureUrl: undefined
    };
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
    let newVenue = {};
    newVenue.name = this.refs.name.value;
    newVenue.phoneNumber = this.refs.phoneNumber.value;
    newVenue.headerImage = this.state.pictureUrl;
    newVenue.website = this.refs.website.value;
    newVenue.minAge = this.refs.minAge.value;
    newVenue.lgbt = this.refs.lgbt.checked;
    newVenue.city = this.refs.city.value;
    newVenue.happyHours = this.refs.happyHours.checked;
    newVenue.description = this.refs.description.value;
    newVenue.dressCode = this.refs.dressCode.value;
    newVenue.genres = this.state.genres;
    newVenue.workingHours = this.state.workingHours;
    newVenue.address = {
      streetAddress: this.state.address,
      zipCode: this.refs.zipcode.value
    };
    newVenue.ticket = {amount: this.refs.ticket.value, currency: '$'};
    newVenue.capacity = this.refs.capacity.value;
    newVenue.placeType = this.refs.placeType.value;
    newVenue.location = {
      coordinates: [this.state.coordinates.lng, this.state.coordinates.lat]
    };

    let token = getToken(this.props.signOut)
    axios
      .post(`${serverUrl}venue`, newVenue, {
        headers: {
          Authorization: token
        }
      })
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
    let token = getToken(this.props.signOut)
    axios
      .post(`${serverUrl}upload-image`, data, {
        headers: {
          Authorization: token
        }
      })
      .then(res => {
        if (res.data.message === 'Successfully uploaded a photo!') {
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

  handleAddress(lat, lng, address) {
    this.setState({
      coordinates: {
        lat,
        lng
      },
      address
    });
  }

  genresHandling(e) {
    e.preventDefault();
    let genresShowing = this.state.showGenres ? false : true;
    this.setState({
      showGenres: genresShowing
    });
  }

  workingHoursHandling(e) {
    e.preventDefault();
    this.setState({
      showWorkingHours: true
    })
  }

  handleTimeChange(value, num, prop) {
    let hours = this.state.workingHours;
    hours[num][prop] = value;
    this.setState({
      workingHours: hours
    })
  }

  render() {
    return (
      <div>
        <h1 className="form-title">New Venue</h1>
        <form className="forms" onSubmit={this.onFormSubmit.bind(this)}>
        <label className="form-label">Venue Name: </label>
          <input type="text" ref="name" className="input" placeholder="Name" required />
          <label className="form-label">Venue Description: </label>
          <textarea
            ref="description"
            className="textarea-input"
            placeholder="Description"
          />
          <label className="form-label">Venue Capacety: </label>
          <input
            type="text"
            ref="capacity"
            className="input"
            placeholder="Capacity"
          />
          <label className="form-label">Place Type: </label>
          <select ref="placeType" className="input">
            <option value="" disabled selected>
              placeType
            </option>
            <option>Bar</option>
            <option>Club</option>
            <option>Longue</option>
          </select>
          <label className="form-label">Ticket Price: </label>
          <input
            type="number"
            min='0'
            ref="ticket"
            className="input"
            placeholder="Ticket Price"
          />
          <label className="form-label">Min Age: </label>
          <input
            type="text"
            ref="minAge"
            className="input"
            placeholder="Min Age"
          />
          <select ref="dressCode" className="input">
            <option value="" disabled selected>
              Dress Code
            </option>
            <option>formal</option>
            <option>stylish</option>
            <option>casual</option>
          </select>
          <label className="form-label">Header Image: </label>
          <input
            type="file"
            ref="image"
            className="input"
            accept="image/gif, image/jpeg, image/png"
            onChange={this.onPictureSelect.bind(this)}
          />
          <div className="checkbox-div">
            <label className="checkbox-label">Lgbt: </label>
            <input type="checkbox" ref="lgbt" className="checkbox-input" />
          </div>
          <div className="checkbox-div">
            <label className="checkbox-label">Happy Hours: </label>
            <input
              type="checkbox"
              ref="happyHours"
              className="checkbox-input"
            />
          </div>
          <label className="form-label">Phone Number: </label>
          <input
            type="text"
            ref="phoneNumber"
            className="input"
            placeholder="Phone Number"
            required
          />
          <label className="form-label">Website: </label>
          <input
            type="text"
            ref="website"
            className="input"
            placeholder="Website"
          />
          <div>
            <label className="form-label">Genres: </label>
            <button
              className="genres-button"
              onClick={this.genresHandling.bind(this)}
            >
              {this.state.showGenres ? 'Hide' : 'Show'}
            </button>
            {this.state.showGenres && (
              <div className="genres-list-div">
                {genres.map((genre, i) => {
                  return (
                    <div key={i} className="checkbox-div-list">
                      <label className="checkbox-label">{genre}:</label>
                      <input
                        className="checkbox-input"
                        checked={this.state.genres.indexOf(genre) !== -1}
                        onChange={e => {
                          let genres = this.state.genres;
                          if (e.target.checked) {
                            genres.push(genre);
                            this.setState({ genres });
                          } else {
                            let newGenres = genres.filter(g => {
                              return g !== genre;
                            });
                            this.setState({ genres: newGenres });
                          }
                        }}
                        type="checkbox"
                      />
                    </div>
                  );
                })}
                <button
                  className="genres-button"
                  onClick={this.genresHandling.bind(this)}
                >
                  Hide
                </button>
              </div>
            )}
          </div>
          <label className="form-label">Working Hours:</label>
          <button
              className="genres-button"
              onClick={this.workingHoursHandling.bind(this)}
          >Show
          </button>
          {this.state.showWorkingHours && (<div>
            <WorkingHours from={this.state.workingHours[0].from} to={this.state.workingHours[0].to} day="Monday" dayNumber={0} handleChange={this.handleTimeChange.bind(this)} />
            <WorkingHours from={this.state.workingHours[1].from} to={this.state.workingHours[1].to}  day="Tuesday" dayNumber={1} handleChange={this.handleTimeChange.bind(this)} />
            <WorkingHours from={this.state.workingHours[2].from} to={this.state.workingHours[2].to}  day="Wednesday" dayNumber={2} handleChange={this.handleTimeChange.bind(this)} />
            <WorkingHours from={this.state.workingHours[3].from} to={this.state.workingHours[3].to}  day="Thursday" dayNumber={3} handleChange={this.handleTimeChange.bind(this)} />
            <WorkingHours from={this.state.workingHours[4].from} to={this.state.workingHours[4].to}  day="Friday" dayNumber={4} handleChange={this.handleTimeChange.bind(this)} />
            <WorkingHours from={this.state.workingHours[5].from} to={this.state.workingHours[5].to}  day="Saturday" dayNumber={5} handleChange={this.handleTimeChange.bind(this)} />
            <WorkingHours from={this.state.workingHours[6].from} to={this.state.workingHours[6].to}  day="Sunday" dayNumber={6} handleChange={this.handleTimeChange.bind(this)} />
            <p className="closed">From '1' to '1' for closed </p>
          </div>)}
          
          <label className="form-label">Address: </label>
          <AddressForm
            defaultAddress={''}
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
          <label className="form-label">City: </label>
          <input type="text" ref="city" className="input" placeholder="City" />
          <input
            type="text"
            ref="zipcode"
            className="input"
            placeholder="Zip Code"
          />
          <input className="submit-button" type="submit" />
        </form>
        {this.state.fireRedirect && <Redirect to="/dashboard/venues" />}
      </div>
    );
  }
}

export default connect(null, actions)(NewVenue);
