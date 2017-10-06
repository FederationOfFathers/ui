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
	pingClick = () => {
		var raid = this.props.state.raids.raids[this.props.state.vars.chan][this.props.state.vars.raid]
		var body = new URLSearchParams()
		body.set('channel', this.props.state.vars.chan)
		body.set('raid', raid.name)
		this.props.state.api.team.ping(body)
	}
	closeClick = () => {
		var raid = this.props.state.raids.raids[this.props.state.vars.chan][this.props.state.vars.raid]
		var body = new URLSearchParams()
		body.set('channel', this.props.state.vars.chan)
		body.set('raid', raid.name)
		console.log(body)
		this.props.state.api.team.close(body)
			.then(function() {
				this.props.state.hasher.set({raid: null, chan: null})
			}.bind(this))
	}
	ownerClick = () => {
	}
	viewingSubNav = () => {
		var raid = this.props.state.raids.raids[this.props.state.vars.chan][this.props.state.vars.raid]
		var inRaid = raid.members.indexOf(this.props.state.user.name)
		var rval = []
		if ( inRaid === 0 ) {
			rval.push((
				<li key="join" className="nav-item px-1 my-1">
					<button onClick={this.joinClick} type="button" className="btn btn-primary w-100">
						Hold Another Spot
					</button>
				</li>
			))
			rval.push((
				<li key="ping" className="nav-item px-1 my-1">
					<button onClick={this.pingClick} type="button" className="btn btn-primary w-100">
						Ping
					</button>
				</li>
			))
			rval.push((
				<li key="finish" className="nav-item px-1 my-1">
					<button onClick={this.closeClick} type="button" className="btn btn-primary w-100">
						Close
					</button>
				</li>
			))
		} else if ( inRaid > 0 ) {
			rval.push((
				<li key="join" className="nav-item px-1 my-1">
					<button onClick={this.joinClick} type="button" className="btn btn-primary w-100">
						Hold Another Spot
					</button>
				</li>
			))
		}
		rval.push((
			<li key="back" className="nav-item px-0 my-1 mx-1" style={{width: "0.25em"}}>
				<button onClick={this.subNavClick} type="button" className="btn btn-primary w-100 px-0 mx-0">
					▼
				</button>
			</li>
		))
		return (
			<ul className="nav nav-pills nav-fill">
				{rval}
			</ul>
		)
	}
	viewingRaid = () => {
		if ( this.state.subNavSelected === true ) {
			return this.viewingSubNav()
		}
		var raid = this.props.state.raids.raids[this.props.state.vars.chan][this.props.state.vars.raid]
		var inRaid = raid.members.indexOf(this.props.state.user.name)
		var rval = []
		switch( inRaid ) {
			case 0:
				rval.push((
					<li key="owner" className="nav-item px-1 my-1">
						<button onClick={this.subNavClick} type="button" className="btn btn-primary w-100">Owner Actions</button>
					</li>
				))
				// owner
				break;
			case -1:
				rval.push((
					<li key="user" className="nav-item px-1 my-1">
						<button onClick={this.joinClick} type="button" className="btn btn-primary w-100">Join This Event</button>
					</li>
				))
				break;
			default:
				rval.push((
					<li className="nav-item px-1 my-1">
						<button onClick={this.joinClick} className="btn btn-primary w-100">Hold Another Spot</button>
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
					<button onClick={this.click} className="btn btn-danger w-100">Cancel</button>
				</li>
			</ul>
		)
	}
	canHostFromHere = () => {
		return (
			<ul className="nav nav-pills nav-fill">
				<li className="nav-item px-1 my-1">
					<button onClick={this.click} className="btn btn-success w-100">Host an Event</button>
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
