import React, { Component } from 'react';
import moment from 'moment';
import Map from './Map';


export default class FestivalInfoPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDay: 0,
            showStages: false
        }
    }

    onSelectDayChange(e) {
        this.setState({
          currentDay: e.target.value
        })
    }

    showStages() {
        this.setState({
            showStages: true
        })
    }

    hideStages() {
        this.setState({
            showStages: false
        })
    }

    render() {
        return (
            <div>
                <div className="white_content">
                    <h2 className="venue-name">{this.props.data.name}</h2>
                    <h4 className="event-date" >{moment(this.props.data.dateFrom).format('dddd, MMMM Do YYYY')} - {moment(this.props.data.dateTo).format('dddd, MMMM Do YYYY')}</h4>
                    {this.props.data.packageTicket.amount ? <p className="venue-informations">Package ticket price is {this.props.data.packageTicket.amount}{this.props.data.packageTicket.currency}</p> : <p className="venue-informations">There is not package ticket price for this festival</p>}
                    <select className="festival-day-select" onChange={this.onSelectDayChange.bind(this)}>
                        {this.props.data.days.map((festivalDay, i) => {
                            return (
                                <option key={i} value={i}>day {i + 1}</option>
                            )
                        })}
                    </select>
                    <div className="festival-day">
                        <div className="venue-map">
                            <Map
                                lat={this.props.data.days[this.state.currentDay].location.coordinates[1]}
                                dragg={false}
                                zoom={15}
                                lng={this.props.data.days[this.state.currentDay].location.coordinates[0]}
                                containerElement={<div style={{ height: 100 + '%' }} />}
                                mapElement={<div style={{ height: 220 + 'px' }} />}
                            />
                        </div>
                        <h2 className="venue-name">{this.props.data.days[this.state.currentDay].name}</h2>
                        <h4 className="event-date" >{moment(this.props.data.days[this.state.currentDay].date).format('dddd, MMMM Do YYYY')}</h4>
                        {this.props.data.days[this.state.currentDay].hour ? <h4 className="event-date" >Starting at {this.props.data.days[this.state.currentDay].hour}h</h4> : <p></p>}
                        {this.props.data.days[this.state.currentDay].ticket.amount ? <h4 className="event-date" >Daily ticket {this.props.data.days[this.state.currentDay].ticket.amount}{this.props.data.days[this.state.currentDay].ticket.currency}</h4> : <p></p>}
                        {this.props.data.days[this.state.currentDay].headerImage ? <div className="venue-pictures">
                        <img
                            className="picture"
                            alt="venue pictue"
                            src={this.props.data.days[this.state.currentDay].headerImage}
                        />
                        </div> : <p></p>}
                        {this.props.data.days[this.state.currentDay].description ? <p className="venue-description">{this.props.data.days[this.state.currentDay].description}</p> : <p></p>}
                        {this.props.data.days[this.state.currentDay].stages.length > 0 ? <button className="stage-button" onClick={this.showStages.bind(this)}>Show Stages</button> : <p></p>}
                        {this.state.showStages && <div className="festival-day-stages">
                            {this.props.data.days[this.state.currentDay].stages.map((stage, i) => {
                                return (
                                    <div key={i} className="festival-day-stage">
                                        <h3 className="venue-name">{stage.stageName}</h3>
                                        <p className="venue-description">{stage.description}</p>
                                    </div>
                                )
                            })}
                        </div>}
                    </div>
                    <button className="venue-popup-button" onClick={() => this.props.closePopup()}>Close</button>
                </div>
                <div  className="black_overlay" onClick={() => this.props.closePopup()} ></div>
            </div>
        )
    }
}