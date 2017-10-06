import React, { Component } from 'react';

class TeamNav extends Component {
	click = () => {
			if ( this.props.state.vars.raid !== "host" ) {
				this.props.state.hasher.set({raid: "host"})
			} else {
				this.props.state.hasher.set({raid: null})
			}
	}
	render = () => {
		if ( this.props.state.vars.main !== "team" ) {
			return null
		}
		if ( this.props.state.vars.raid === "host" ) {
			return (
				<ul className="nav nav-pills nav-fill">
					<li className="nav-item px-1 my-1">
						<button onClick={this.click} className="btn btn-danger w-100">Cancel</button>
					</li>
				</ul>
			)
		} else if ( typeof this.props.state.vars.raid !== 'undefined' && this.props.state.vars.raid !== null ) {
			return (
				<ul className="nav nav-pills nav-fill">
					<li className="nav-item px-1 my-1">
						<button onClick={this.click} className="btn btn-primary w-100">Join This Event</button>
					</li>
				</ul>
			)
		}
		return (
			<ul className="nav nav-pills nav-fill">
				<li className="nav-item px-1 my-1">
					<button onClick={this.click} className="btn btn-success w-100">Host an Event</button>
				</li>
			</ul>
		)
	}
}

export default TeamNav
