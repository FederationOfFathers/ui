import React, { Component } from 'react';
import EventChannel from './event-channel'
import EventHost from './event-host'

class Events extends Component {
    eventChannels = () => {
        //TODO sort the channels
        let eventChannels = []
        for (let idx in this.props.state.events) {
            if (this.props.state.events[idx].events.length > 0) {
                eventChannels.push(<EventChannel key={idx} channel={this.props.state.events[idx]} state={this.props.state}/>);
            }
        }

        return eventChannels
    }

    render = () => {

        if ( this.props.state.vars.event === "host") {
            return (<EventHost state={this.props.state} />)
        }
        return (
            <div className="team container container-fluid">
            <h3>Events</h3>
				{this.eventChannels()}
			</div>
        )
    }
}

export default Events
