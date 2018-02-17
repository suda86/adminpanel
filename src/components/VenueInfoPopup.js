import React from 'react';
import './style/form.css';

export default (props) => {
  return (
    <div>
      <div className="white_content">
        <h2 className="venue-name">{props.data.name}</h2>
        {props.data.address.streetAddress ? <p className="venue-informations">{props.data.address.streetAddress}</p> : <p></p>}
        {props.data.address.zipCode ? <p className="venue-informations">{props.data.address.zipCode}</p> : <p></p>}
        {props.data.city ? <p className="venue-informations">{props.data.city}</p> : <p></p>}
        {props.data.capacity ? <p className="venue-informations"> Capacity of this place is{props.data.capacity}</p> : <p></p>}
        {props.data.phoneNumber ? <p className="venue-informations">Phone number is {props.data.phoneNumber}</p> : <p></p>}
        {props.data.website ? <p className="venue-informations">Website is {props.data.website}</p> : <p></p>}
        <p className="venue-informations">This is {props.data.dressCode ? props.data.dressCode  : 'free'} dress code place, it {props.data.lgbt ? 'is' : 'is not'} LGBT</p>
        {props.data.placeType ? <p className="venue-informations">The place type is {props.data.placeType}</p> : <p></p>}
        {props.data.ticket ? <p className="venue-informations">Default ticket price is {props.data.ticket.amount}{props.data.ticket.currency}</p> : <p className="venue-informations">There is not default tickets for tis place</p>}
        {props.data.minAge ? <p className="venue-informations">Min age is {props.data.minAge}</p> : <p></p>}
        <p className="venue-informations">You can listen next genres in this venue: {props.data.genres.length > 0 ? props.data.genres.map(genre => `${genre}, ` ) : ''}</p>
        
        <button className="venue-popup-button" onClick={() => props.closePopup()}>Close</button>
      </div>   
      <div  className="black_overlay" onClick={() => props.closePopup()} ></div>
    </div>
    )
}