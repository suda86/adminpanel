import React, { Component } from 'react';
import moment from 'moment';
import './style/venue.css';
import { Link } from 'react-router-dom'

let days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default class WorkingDaysPopup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      day: moment().day()
    }
  }
  render() {
    console.log(this.state.day);
    function renderDayEvents(day) {
        let dayEvents = this.props.data.filter((workingDay) => {
          return moment(workingDay.date).day() === day;
        })
        if(dayEvents.length > 0) {
          return (
            <div>
              {dayEvents.map((event, i) => {
                return (
                  <div className="working-day-event" key={i}>
                    <h3 className="working-day-name">{event.name}</h3>
                    <img className="working-day-picture" src={event.headerImage} alt="picture place" />
                    <p className="working-day-description">{event.description}</p>
                    <Link className="working-day-link" to={`/dashboard/event/${event._id}`}>More information about event</Link>
                  </div>
                )
              })}
            </div>
          )
        } else {
          return (
            <div className="working-day-event">
              <h3 className="working-day-time">There are no events this day</h3>
            </div>
          )
        }
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
            <button onClick={() => this.setState({day: 0})} className="days-nav-p">Sun</button>
            </div>
        </div>
        <h2 className="venue-name">{days[this.state.day]}</h2>
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