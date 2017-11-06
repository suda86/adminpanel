import React, { Component } from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';
import './style/form.css';

class AddressForm extends Component {
  constructor(props) {
    super(props);
    this.state = { address: props.defaultAddress };
    this.onChange = address => this.setState({ address });
  }

  handleFormSubmit = event => {
    event.preventDefault();
    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(latLng =>
        this.props.setLatLng(latLng.lat, latLng.lng, this.state.address)
      )
      .catch(error => console.error('Error', error));
  };

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
      placeholder: 'Address'
    };

    const cssClasses = {
      input: 'input'
    };

    return (
      <div>
        <PlacesAutocomplete inputProps={inputProps} classNames={cssClasses} />
        <button className="address-button" onClick={this.handleFormSubmit}>
          Add Address
        </button>
      </div>
    );
  }
}

export default AddressForm;
