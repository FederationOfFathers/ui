import React, { Component } from 'react';

class RaidMember extends Component {
	click = () => {
		this.props.state.hasher.replace({main: "members", member: this.props.id})
	}
	render = () => {
		return (
			<li
				key={"m-"+this.props.ii}
				id={this.props.id}
				onClick={this.click}
				style={{cursor: 'pointer'}}
				className="list-group-item list-group-item-primary">{this.props.text}</li>
		)
	}
}

class Raid extends Component {
	memberClick = ( e ) => {
		console.log(e.target)
		return
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
		<ul className="list-group">
			{this.members()}
			{this.alts()}
		</ul>
	)
}
}

export default Raid
