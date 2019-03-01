import React, { Component } from 'react';
import Event from './event'


// props = channel, state
class EventChannel extends Component {
	constructor(props) {
		super(props)

		this.state={
			expanded: false,
		}
	}

	clickHandler = () => {
		this.setState({expanded: !this.state.expanded})
	}

	channelEvents = () => {
		if (!this.state.expanded) {
			return null
		}
		let eventComponents = []
		let events = this.props.channel.events;
		for (let i in events) {
			eventComponents.push(<Event key={i} event={events[i]} state={this.props.state} />)
		}

		return eventComponents
	}
    render = () => {
		// don't display if no events
		if (this.props.channel.events.length <= 0) {
			return null
		}

		let channelName = ""
		if (this.props.channel.categoryname !== "") {
			channelName += this.props.channel.categoryName + ": ";
		}
		channelName += this.props.channel.name;

        return (
			<div className="channel">
				<button className="btn btn-block btn-primary" onClick={this.clickHandler}>{channelName}</button>
				<div className="channel events">
					{this.channelEvents()}
				</div>
			</div>
        )
    }
}

export default EventChannel