import React from 'react';
import './style/form.css';

export default (props) => {
  return (
    <div>
      <div className="white_content">
        <h2 className="venue-name">{props.data.name}</h2>
        {props.data.address.streetAddress ? <p className="venue-informations">{props.data.address.streetAddress}</p> : <p className="venue-informations">unknown address</p>}
        {props.data.address.zipCode ? <p className="venue-informations">{props.data.address.zipCode}</p> : <p></p>}
        {props.data.ticket ? <p className="venue-informations">Ticket price is {props.data.ticket}</p> : <p className="venue-informations">There are not default tickets for this place</p>}
        <p className="venue-informations">This is {props.data.isRecurrent ? 'recurrent' : 'not recurrent'} event</p>
        <button className="venue-popup-button" onClick={() => props.closePopup()}>Close</button>
      </div>   
      <div  className="black_overlay" onClick={() => props.closePopup()} ></div>
    </div>
    )
}