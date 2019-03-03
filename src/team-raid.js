import React, { Component } from 'react';

class RaidMember extends Component {
	click = () => {
		this.props.state.hasher.replace({main: "members", member: this.props.id})
	}
	leave = () => {
		var body = new URLSearchParams()
		body.set('channel', this.props.state.vars.chan)
		body.set('raid', this.props.data.name)
		this.props.state.api.team.leave(body)
			.then(function() {
				this.props.state.hasher.set({raid: null, chan: null})
			}.bind(this))
	}
	ping = (e) => {
		var raid = this.props.state.raids.raids[this.props.state.vars.chan][this.props.state.vars.raid]
		var body = new URLSearchParams()
		body.set('channel', this.props.state.vars.chan)
		body.set('raid', raid.name)
		this.props.state.api.team.ping(body)
	}
	close = () => {
		var raid = this.props.state.raids.raids[this.props.state.vars.chan][this.props.state.vars.raid]
		var body = new URLSearchParams()
		body.set('channel', this.props.state.vars.chan)
		body.set('raid', raid.name)
		this.props.state.api.team.close(body)
			.then(function() {
				this.props.state.hasher.set({raid: null, chan: null})
			}.bind(this))
	}
	new = () => {
		return {
		}
	}
	render = () => {
		var actions = []
		var colorClass = "btn-secondary"
		if ( this.props.i === "0" ) {
			colorClass = "btn-dark"
		} else if ( this.props.data.need !== "0" && this.props.i >= this.props.data.need ) {
			colorClass = "btn-light text-secondary"
		}
		var classes = "btn " + colorClass
		if ( this.props.id === this.props.state.user.name ) {
			classes = classes + " w-100"
			actions.push((
				<button
					key="dd"
					id="btnGroupDrop1"
					type="button"
					className={"btn " + colorClass + " dropdown-toggle"}
					data-toggle="dropdown"
					aria-haspopup="true"
					aria-expanded="false">☰
				</button>

			))
			if ( this.props.data.members[0] === this.props.id ) {
				actions.push((
					<div className="dropdown-menu p-0 border-0 w-100" key="om">
						<div className="btn-group-vertical w-100 m-0 m-0 border-1">
							<button onClick={this.leave} className="btn btn-outline-primary">Leave Event</button>
							<button onClick={this.ping}  className="btn btn-outline-primary">Ping Members</button>
							<button onClick={this.close} className="btn btn-outline-primary">Close Event</button>
						</div>
					</div>
				))
			} else {
				actions.push((
					<div className="dropdown-menu p-0 border-0 w-100" key="om">
						<div className="btn-group-vertical w-100 m-0 m-0 border-1">
							<button onClick={this.leave} className="btn btn-outline-primary">Leave Event</button>
						</div>
					</div>
				))
			}
		} else {
			classes = classes + " w-75"
			actions = (
				<button className={colorClass + " btn w-25"} type="button" onClick={this.click}>&nbsp;</button>)
		}
		return (
			<div className="my-1 w-100 btn-group" role="group">
				<button key={"m-"+this.props.ii} onClick={this.click} type="button" className={classes}>{this.props.text}</button>
				{actions}
			</div>
		)
	}
}

class RaidPlaceHolder extends Component {
	render = () => {
		return (
			<div className="my-1 w-100 btn-group" role="group">
				<button type="button" className="w-75 btn btn-light text-secondary">member needed</button>
				<button className={"btn btn-light w-25"} type="button">&nbsp;</button>
			</div>
		)
	}
}

class Raid extends Component {
	memberClick = ( e ) => {
		this.props.state.hasher.replace({main: "members", member: e.target.id})
	}
	combined = () => {
		var rval = []
		for ( var i in this.props.data.members ) {
			rval.push(this.props.data.members[i])
		}
		if ( this.props.data.alts !== null ) {
			for ( var ai in this.props.data.alts ) {
				rval.push(this.props.data.alts[ai])
			}
		}
		return rval
	}
	placeholders = () => {
		if ( this.props.data.need < 1 ) {
			return null
		}
		var list = this.combined()
		var have = list.length
		if ( have >= this.props.data.need ) {
			return null
		}
		var rval = []
		for (var i=0; i<this.props.data.need-have; i++) {
			rval.push((<RaidPlaceHolder key={i}/>))
		}
		return rval
	}
	members = () => {
		var rval = []
		var list = this.combined()
		for ( var i in list ) {
			var iInt = parseInt(i, 10)
			if ( iInt === 0 ) {
				rval.push((<div key="own" className="btn-group text-secondary px-3" role="group">⇊ owner</div>))
			}
			if ( iInt === 1 ) {
				rval.push((<div key="mem" className="btn-group text-secondary px-3" role="group">⇊ members</div>))
			}
			if ( this.props.data.need > 0 && iInt === this.props.data.need ) {
				rval.push((<div key="alt" className="btn-group text-secondary px-3" role="group">⇊ alternate queue</div>))
			}
			// Treat as member id or display as is if no matching id found
			var member = list[i]
			var username = "unknown (" + member + ")";
			var user = this.props.state.users[member]
			if (user !== undefined) {
				username = user.User.Name
			} 

			rval.push(
				<RaidMember key={"m-"+i}
					data={this.props.data}
					i={i}
					id={member}
					state={this.props.state}
					text={username}/>
			)
		}
		return rval
	}
	render = () => {
		return (
			<div>
				{this.members()}
				{this.placeholders()}
			</div>
		)
	}
}

export default Raid
