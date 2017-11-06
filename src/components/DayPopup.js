import React, { Component } from 'react';
import axios from 'axios';
import Map from './Map';
import FormData from 'form-data';
import AddressForm from './Address';
import './style/form.css';
import moment from 'moment';

export default class DayPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coordinates: {
        lng: props.data.location.coordinates[0],
        lat: props.data.location.coordinates[1]
      },
      stages: props.data.stages,
      hour: props.data.hour,
      streetAddress: props.data.address.streetAddress,
      zipCode: props.data.address.zipCode,
      description: props.data.description,
      pictureUrl: props.data.headerImage,
      isActive: props.data.isActive,
      name: props.data.name,
      ticket: props.data.ticket
    };
  }

  closePopup() {
    this.props.closePopup()
  }

  onFormSubmit(e) {
    e.preventDefault();
    let dayInfo = {};
    dayInfo.day = this.props.data.day;
    dayInfo.entered = true;
    dayInfo.date = this.props.data.date;
    dayInfo.hour = this.state.hour;
    dayInfo.name = this.state.name;
    dayInfo.description = this.state.description;
    dayInfo.ticket = this.state.ticket;
    dayInfo.headerImage = this.state.pictureUrl;
    dayInfo.isActive = this.state.isActive;
    dayInfo.location = {
      coordinates: [this.state.coordinates.lng, this.state.coordinates.lat]
    };
    dayInfo.address = {
      streetAddress: this.state.streetAddress,
      zipCode: this.state.zipCode
    };
    let stages = this.state.stages.map((stage, i) => {
      return {
        stageName: this.refs[`stagename${i}`].value,
        description: this.refs[`stagedescription${i}`].value
      }
    })
    dayInfo.stages = stages;
    this.props.addDay(dayInfo, this.props.data.day);
    this.props.closePopup();
    console.log(dayInfo);
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

  addStage(e) {
    e.preventDefault();
    let stages = this.state.stages;
    stages.push({name: '', description: ''});
    this.setState({
      stages
    })
  }

  render() {
    return (
      <div className="popup" >
        <div className="white_content">
          <h3 className="day-form-header">Add information for {moment(this.props.data.date).format('dddd, MMMM Do YYYY')}, {this.props.data.day}. day of the festival</h3>
          <form className="forms" onSubmit={this.onFormSubmit.bind(this)}>
          <label className="form-label">Name: </label>
          <input
            type="text"
            value={this.state.name}
            onChange={(e) => this.setState({name: e.target.value})}
            className="input"
            placeholder="name"
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
            value={this.state.zipCode}
            onChange={(e) => this.setState({zipCode: e.target.value})}
            className="input"
            placeholder="Zip Code"
          />
          <label className="form-label">Hour: </label>
          <input
            type="text"
            value={this.state.hour}
            onChange={(e) => this.setState({hour: e.target.value})}
            className="input"
            placeholder="Hour"
          />
          <div className="checkbox-div">
            <label className="checkbox-label">Is Active: </label>
            <input 
            type="checkbox" 
            checked={this.state.isActive}
            onChange={(e) => this.setState({isActive: e.target.checked})}
            className="checkbox-input" />
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
            value={this.state.ticket}
            onChange={(e) => this.setState({ticket: e.target.value})}
            className="input"
            placeholder="Ticket Price"
          />
          <label className="form-label">Description: </label>
          <textarea
            value={this.state.description}
            onChange={(e) => this.setState({description: e.target.value})}
            className="textarea-input"
            placeholder="Description"
          />
          <label className="form-label">Stages: </label>
          {this.state.stages.map((stage, i) => {
            return (
              <div key={i}>
                <label className="form-label">Stage name: </label>
                <input
                  type="text" 
                  ref={`stagename${i}`} 
                  value={this.state.stages[i].stageName}
                  onChange={(e) => {
                    let stages = this.state.stages;
                    stages[i].stageName = e.target.value;
                    this.setState({
                      stages: stages
                    })
                  }}
                  placeholder="Stage name" 
                  className="input" />
                <label className="form-label">Stage description: </label>
                <textarea 
                  placeholder="Stage description" 
                  ref={`stagedescription${i}`} 
                  value={this.state.stages[i].description}
                  onChange={(e) => {
                    let stages = this.state.stages;
                    stages[i].description = e.target.value;
                    this.setState({
                      stages: stages
                    })
                  }}
                  className="textarea-input" />
              </div>
            )
          })}
          <button className="add-stage-button" onClick={this.addStage.bind(this)} >Add stage</button>
          <input value="Save" className="submit-button" type="submit" />
        </form>
        </div>
        <div  className="black_overlay" onClick={this.closePopup.bind(this)} ></div>
      </div>
    )
  }
}