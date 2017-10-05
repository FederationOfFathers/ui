import React, { Component } from 'react';

class Raid extends Component {
	memberClick = ( e ) => {
		this.props.state.hasher.replace({main: "members", member: e.target.id})
	}
	members = () => {
		var rval = []
		for ( var i in this.props.data.members ) {
			rval.push(<li
				key={"m-"+i}
				id={this.props.data.members[i]}
				onClick={this.memberClick}
				style={{cursor: 'pointer'}}
				className="list-group-item list-group-item-primary">{this.props.data.members[i]}</li>)
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
