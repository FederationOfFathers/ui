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
	new = () => {
		return {
		}
	}
	render = () => {
		var leave = null
		var classes = "btn btn-secondary"
		if ( this.props.id === this.props.state.user.name ) {
			classes = classes + " w-75"
			leave = (<button onClick={this.leave} className="btn-warning btn w-25">Leave</button>)
		} else {
			classes = classes + " w-75"
			leave = (<button className="btn btn-secondary w-25" type="button" onClick={this.click}>&nbsp;</button>)
		}
		return (
			<div className="my-1 w-100 btn-group" role="group">
				<button key={"m-"+this.props.ii} onClick={this.click} type="button" className={classes}>{this.props.text}</button>
				{leave}
			</div>
		)
	}
}

class Raid extends Component {
	memberClick = ( e ) => {
		this.props.state.hasher.replace({main: "members", member: e.target.id})
	}
	members = () => {
		var rval = []
		for ( var i in this.props.data.members ) {
			var text = (<div className="py-2">{this.props.data.members[i]}</div>)
			if ( i === "0" ) {
				text = (<div className="py-2"><strong>{this.props.data.members[i]}</strong></div>)
			}
			rval.push(
				<RaidMember key={"m-"+i}
					data={this.props.data}
					id={this.props.data.members[i]}
					state={this.props.state}
					text={text}/>
			)
	}
	return rval
}
alts = () => {
	var rval = []
	if ( this.props.data.alts !== null ) {
		for ( var i in this.props.data.alts ) {
			rval.push(
				<li key={"a-"+i} className="list-group-item disabled">
					{this.props.data.alts[i]}
				</li>
			)
		}
	}
	return rval
}
render = () => {
	return (
		<div>
			{this.members()}
			<ul className="list-group">
				{this.alts()}
			</ul>
		</div>
	)
}
}

export default Raid
