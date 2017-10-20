import React, { Component } from 'react';

class TeamNav extends Component {
	componentWillMount = () => {
		this.setState({
			subNavSelected: false,
		})
	}
	subNavClick = () => {
		if ( this.state.subNavSelected === true ) {
			this.setState({subNavSelected: false})
		} else {
			this.setState({subNavSelected: true})
		}
	}
	click = () => {
		if ( this.props.state.vars.raid !== "host" ) {
			this.props.state.hasher.set({raid: "host"})
		} else {
			this.props.state.hasher.set({raid: null})
		}
	}
	joinClick = () => {
		var raid = this.props.state.raids.raids[this.props.state.vars.chan][this.props.state.vars.raid]
		var body = new URLSearchParams()
		body.set('channel', this.props.state.vars.chan)
		body.set('raid', raid.name)
		this.props.state.api.team.join(body)
	}
	viewingRaid = () => {
		if ( this.state.subNavSelected === true ) {
			return this.viewingSubNav()
		}
		var raid = this.props.state.raids.raids[this.props.state.vars.chan][this.props.state.vars.raid]
		if ( typeof raid === "undefined" ) {
			// raid no longer exists...
			return this.canHostFromHere()
		}
		var inRaid = raid.members.indexOf(this.props.state.user.name)
		var rval = []
		var text = ""
		switch( inRaid ) {
			case -1:
				text = "Join This Event"
				if ( raid.need > 0 && raid.members.length >= raid.need ) {
					text = "It's full, but I'll wait in line"
				}
				rval.push((
					<li key="user" className="nav-item px-1 my-1">
						<button onClick={this.joinClick} type="button" style={{fontSize: "0.7em"}} className="btn btn-primary w-100">{text}</button>
					</li>
				))
				break;
			default:
				text = "Hold Another Spot"
				if ( raid.need > 0 && raid.members.length >= raid.need ) {
					text = "It's full, but I'll hold a spot in line"
				}
				rval.push((
					<li key="join" className="nav-item px-1 my-1">
						<button style={{fontSize: "0.7em"}} onClick={this.joinClick} className="btn btn-primary w-100">{text}</button>
					</li>
				));
				break;
		}
		return (
			<ul className="nav nav-pills nav-fill">
				{rval}
			</ul>
		)
	}
	addingRaid = () => {
		return (
			<ul className="nav nav-pills nav-fill">
				<li className="nav-item px-1 my-1">
					<button onClick={this.click} style={{fontSize: "0.7em"}} className="btn btn-danger w-100">Cancel</button>
				</li>
			</ul>
		)
	}
	canHostFromHere = () => {
		return (
			<ul className="nav nav-pills nav-fill">
				<li className="nav-item px-1 my-1">
					<button onClick={this.click} style={{fontSize: "0.7em"}} className="btn btn-success w-100">Host an Event</button>
				</li>
			</ul>
		)
	}
	render = () => {
		if ( this.props.state.vars.main !== "team" ) {
			return null
		}
		if ( this.props.state.vars.raid === "host" ) {
			return this.addingRaid()
		}
		if ( typeof this.props.state.vars.raid !== 'undefined' && this.props.state.vars.raid !== null ) {
			return this.viewingRaid()
		}
		return this.canHostFromHere()
	}
}

export default TeamNav
