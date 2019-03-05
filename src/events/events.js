import React, { Component } from 'react';
import EventChannel from './event-channel'
import EventHost from './event-host'

class Events extends Component {
	isListableChannel = (channel) => {
		if (this.props.state.admin === true) {	// admins host anywhere
			return true
		}
		if (this.props.state.verified === false) {	// unverified can't host
			return false
		}
		let listableCategories = [
			"444608078411989012", // PC Games
			"444608230140674059", // PS4
			"439890949569642498", // Xbox
			"444608367118516225", // Switch
			"440693691192049675", // Random
		]
		return listableCategories.indexOf(channel.categoryID) > -1;
	}
    eventChannels = () => {
        //TODO sort the channels
        let eventChannels = []
        for (let idx in this.props.state.events) {
            if (this.props.state.events[idx].events.length > 0 && this.isListableChannel(this.props.state.events[idx])) {
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
