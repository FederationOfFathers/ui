import React, { Component } from 'react';

class Raid extends Component {
	memberClick = ( e ) => {
		this.props.state.hasher.replace({main: "members", member: e.target.id})
	}
	members = () => {
		var rval = []
		for ( var i in this.props.data.members ) {
			var text = (<div className="py-2">{this.props.data.members[i]}</div>)
			var leave = null
			if ( this.props.data.members[i] === this.props.state.user.name ) {
				leave = (
					<button className="btn btn-warning float-right" type="button">leave</button>
				)
			}
			if ( i === "0" ) {
				text = (<div className="py-2"><strong>{this.props.data.members[i]}</strong></div>)
			}
			rval.push(<li
				key={"m-"+i}
				id={this.props.data.members[i]}
				onClick={this.memberClick}
				style={{cursor: 'pointer'}}
				className="list-group-item list-group-item-primary">{leave}{text}</li>)
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
			<ul className="list-group">
				{this.members()}
				{this.alts()}
			</ul>
		)
	}
}

export default Raid
