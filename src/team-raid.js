import React, { Component } from 'react';

class Raid extends Component {
	members = () => {
		var rval = []
		for ( var i in this.props.data.members ) {
			rval.push(<li key={"m-"+i} className="list-group-item">{this.props.data.members[i]}</li>)
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
