import React, { Component } from 'react';
import * as actions from '../actions/actions';
import { connect } from 'react-redux';
import axios from 'axios';
import Map from './Map';
import FormData from 'form-data';
import { Redirect } from 'react-router-dom';
import AddressForm from './Address';
import moment from 'moment';
import DayPopup from './DayPopup';

class NewEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: {
        lng: -79.38318429999998,
        lat: 43.653226
      },
      error: '',
      streetAddress: 'Toronto, ON',
      fireRedirect: false,
      dayPopup: false,
      currentDay: undefined,
      dateFrom: moment().format('YYYY-MM-DD'),
      dateTo: moment().format('YYYY-MM-DD'),
      pictureUrl: undefined,
      days: [
        {
          name: '',
          date: moment().format('YYYY-MM-DD'),
          description: '',
          day: 1,
          isActive: true,
          hour: '20',
          headerImage: '',
          ticket: '',
          address: {
            streetAddress: 'Toronto, ON',
            zipCode: ''
          },
          location: {
            coordinates: [-79.38318429999998, 43.653226]
          },
          stages: [],
          entered: false
        }
      ]
    };
  }

  onFormSubmit(e) {
    e.preventDefault();
    let newFestival = {};
    newFestival.name = this.refs.name.value;
    newFestival.description = this.refs.description.value;
    newFestival.dateFrom = this.state.dateFrom;
    newFestival.dateTo = this.state.dateTo;
    newFestival.isActive = this.refs.isactive.checked;
    newFestival.headerImage = this.state.pictureUrl;    
    newFestival.packageTicket = this.refs.ticket.value;
    newFestival.address = {
      streetAddress: this.state.streetAddress,
      zipCode: this.refs.zipcode.value
    };
    newFestival.location = {
      coordinates: [this.state.coordinates.lng, this.state.coordinates.lat]
    };
    newFestival.days = this.state.days;
    console.log(newFestival);
    for(let i = 0; i < newFestival.days.length; i ++) {
      if (!newFestival.days[i].entered) {
        return this.setState({
          error: 'You must enter data for all days'
        })
      }
    }
    console.log(newFestival);
    const storage = JSON.parse(localStorage.getItem('adminpanel'));
    let token;
    if (storage) {
      token = 'Bearer ' + storage.token;
    } else {
      return this.props.signOut();
    }
    axios
      .post(`http://46.101.135.245:8010/api/v1/festival`, newFestival, {
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

  onDateFromChange(e) {
    this.setState({
      dateFrom: e.target.value
    });
    if (
      moment(e.target.value).valueOf() > moment(this.state.dateTo).valueOf()
    ) {
      this.setState({
        dateTo: e.target.value,
        days: [{
          name: '',
          date: e.target.value,
          description: '',
          day: 1,
          hour: '20',
          isActive: true,
          headerImage: '',
          ticket: '',
          address: {
            streetAddress: '',
            zipCode: ''
          },
          location: {
            coordinates: [-79.38318429999998, 43.653226]
          },
          stages: [],
          entered: false
        }]
      });
    }
    let difference = Math.ceil(
      (moment(this.state.dateTo).valueOf() - moment(e.target.value).valueOf()) /
        82360800
    );
    let arr = [{
      name: '',
      date: e.target.value,
      description: '',
      day: 1,
      hour: '20',
      isActive: true,
      headerImage: '',
      ticket: '',
      address: {
        streetAddress: '',
        zipCode: ''
      },
      location: {
        coordinates: [-79.38318429999998, 43.653226]
      },
      stages: [],
      entered: false
    }];
    for (let i = 1; i < difference; i++) {
      arr.push({
        name: '',
        date: moment(e.target.value).add(i, 'days').format('YYYY-MM-DD'),
        description: '',
        day: i + 1,
        hour: '20',
        isActive: true,
        headerImage: '',
        ticket: '',
        address: {
          streetAddress: '',
          zipCode: ''
        },
        location: {
          coordinates: [-79.38318429999998, 43.653226]
        },
        stages: [],
        entered: false
      });
    }
    this.setState({
      days: arr
    });
  }

  onDateToChange(e) {
    this.setState({
      dateTo: e.target.value
    });
    let difference = Math.ceil(
      (moment(e.target.value).valueOf() -
        moment(this.state.dateFrom).valueOf()) /
        82360800
    );
    let arr = [{
      name: '',
      date: this.state.dateFrom,
      description: '',
      day: 1,
      hour: '20',
      isActive: true,
      headerImage: '',
      ticket: '',
      address: {
        streetAddress: '',
        zipCode: ''
      },
      location: {
        coordinates: [-79.38318429999998, 43.653226]
      },
      stages: [],
      entered: false
    }];
    for (let i = 1; i < difference; i++) {
      arr.push({
        name: '',
        date: moment(this.state.dateFrom).add(i, 'days').format('YYYY-MM-DD'),
        description: '',
        day: i + 1,
        hour: '20',
        isActive: true,
        headerImage: '',
        ticket: '',
        address: {
          streetAddress: '',
          zipCode: ''
        },
        location: {
          coordinates: [-79.38318429999998, 43.653226]
        },
        stages: [],
        entered: false
      });
    }
    this.setState({
      days: arr
    });
  }

  onDayButtonClick(e) {
    e.preventDefault();
    this.setState({
      dayPopup: true,
      currentDay: this.state.days[e.target.dataset.day]
    })
  }

  closeDayPopup() {
    this.setState({
      dayPopup: false
    })
  }

  handleAddDay(dayInfo, day) {
    let days = this.state.days;
    days[day - 1] = dayInfo;
    this.setState({
      days: days
    })
  }

  render() {
    return (
      <div>
        <h1 className="form-title">New Festival</h1>
        <form className="forms" onSubmit={this.onFormSubmit.bind(this)}>
          <label className="form-label">Name: </label>
          <input type="text" ref="name" className="input" placeholder="Name" required />
          <label className="form-label">Date From: </label>
          <input
            type="date"
            value={this.state.dateFrom}
            onChange={this.onDateFromChange.bind(this)}
            min={moment().format('YYYY-MM-DD')}
            className="input"
            placeholder="Date"
          />
          <label className="form-label">Date To: </label>
          <input
            type="date"
            value={this.state.dateTo}
            onChange={this.onDateToChange.bind(this)}
            min={this.state.dateFrom}
            className="input"
            placeholder="Date"
          />
          <div>
            {this.state.days.map((festivalDay, i) => {
              return (
                <button key={i} className="days-settings-button" data-day={i} onClick={this.onDayButtonClick.bind(this)} >
                  {festivalDay.entered ? `Edit day ${i + 1}` : `Add information about day ${i + 1}`}
                </button>
              );
            })}
          </div>
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
          <label className="form-label">Header Image: </label>
          <input
            type="file"
            ref="image"
            className="input"
            accept="image/gif, image/jpeg, image/png"
            onChange={this.onPictureSelect.bind(this)}
          />
          <label className="form-label">Package Ticket: </label>
          <input
            type="text"
            ref="ticket"
            className="input"
            placeholder="Package Ticket Price"
          />
          <label className="form-label">Description: </label>
          <textarea
            ref="description"
            className="textarea-input"
            placeholder="Description"
          />
          <p style={{color: "red", textAlign: "center"}}>{this.state.error}</p>
          <input value="Send" className="submit-button" type="submit" />
        </form>
        {this.state.fireRedirect && <Redirect to={`/dashboard/festivals`} />}
        {this.state.dayPopup && <DayPopup closePopup={this.closeDayPopup.bind(this)} addDay={this.handleAddDay.bind(this)} data={this.state.currentDay} />}
      </div>
    );
  }
}

export default connect(null, actions)(NewEvent);
