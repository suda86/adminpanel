import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker} from 'react-google-maps'

class Map extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lat: props.lat,
      lng: props.lng
    }
  }
  onMarkerDrag(e) {
    let lat = e.latLng.lat();
    let lng = e.latLng.lng();
    this.props.changeCoordinates(lat, lng);
    this.setState({
      lat,
      lng
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      lat: nextProps.lat,
      lng: nextProps.lng
    })
  }

  render() {
    return (
      <GoogleMap defaultZoom={this.props.zoom} center={{lat: this.state.lat, lng: this.state.lng}}>
        <Marker position={{ lat: this.props.lat, lng: this.props.lng }} draggable={this.props.dragg} onDragEnd={this.onMarkerDrag.bind(this)} />
      </GoogleMap>
    )
  }
}

export default withGoogleMap(Map);
