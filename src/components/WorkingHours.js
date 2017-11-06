import React from 'react';
import './style/form.css';

export default (props) => {
    return (
        <div className="hours-div">
        <label className="hours-label">{props.day}: </label>
        <label className="hours-label-in">From: </label>
        <input 
          className="hours-inpuut" 
          type="number" 
          value={props.from}
          min="1" 
          max="23" 
          placeholder="from"
          onChange={(e) => props.handleChange(Math.round(e.target.value), props.dayNumber, 'from')}
        />
        <label className="hours-label-in">To: </label>
        <input 
          className="hours-inpuut" 
          type="number" 
          value={props.to}
          min="1" 
          max="24" 
          placeholder="to"
          onChange={(e) => props.handleChange(Math.round(e.target.value), props.dayNumber, 'to')}
        /> 
      </div>
    )
}