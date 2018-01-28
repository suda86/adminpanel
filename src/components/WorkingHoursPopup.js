import React, { Component } from 'react';
import moment from 'moment';
import './style/venue.css';

let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default class WorkingDaysPopup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      day: moment().day() + 1
    }
  }

  render() {
    function styleNumber(n) {
        if(n < 10) {
            return '0' + n
        }
        return '' + n
    }
    function renderDayEvents(day) {
        let dayhours = this.props.data[this.state.day - 1];
        if(dayhours.from === 1 && dayhours.to === 1) {
          return (
            <div className="working-day-event">
              <h5 className="working-day-time">Place dont work this day</h5>
            </div>
          )
        }
        return (
            <div className="working-day-event">
              <h3 className="working-day-name">From:</h3>
              <h5 className="working-day-time">{styleNumber(dayhours.from)}</h5>
              <h3 className="working-day-name">to:</h3>
              <h5 className="working-day-time">{styleNumber(dayhours.to)}</h5>
            </div>
          )
    }
    return (
    <div>
        <div className="white_content">
        <div className="nav">
            <div className="nav-div">
            <button onClick={() => this.setState({day: 1})} className="days-nav-p">Mon</button>
            <button onClick={() => this.setState({day: 2})} className="days-nav-p">Tue</button>
            <button onClick={() => this.setState({day: 3})} className="days-nav-p">Wed</button>
            <button onClick={() => this.setState({day: 4})} className="days-nav-p">Thu</button>
            <button onClick={() => this.setState({day: 5})} className="days-nav-p">Fri</button>
            <button onClick={() => this.setState({day: 6})} className="days-nav-p">Sat</button>
            <button onClick={() => this.setState({day: 7})} className="days-nav-p">Sun</button>
            </div>
        </div>
        <h2 className="venue-name">{days[this.state.day - 1]}</h2>
        <div>
            {renderDayEvents.bind(this)(this.state.day)}   
        </div>
        <button className="working-days-popup-button" onClick={() => this.props.closePopup()}>Close</button>
        </div>
        <div  className="black_overlay" onClick={() => this.props.closePopup()} ></div>
    </div>
    )
  }
}