import React, { Component } from 'react';

class Members extends Component {
	componentWillMount = () => {
		this.defaultToMe()
	}
	componentDidMount = () => {
		this.defaultToMe()
	}
	defaultToMe = () => {
		var doDefault = false
		if ( typeof this.props.state.vars.member === "undefined" ) {
			doDefault = true
		} else if ( this.props.state.vars.member === "" ) {
			doDefault = true
		}
		var validUser = false
		for ( var id in this.props.state.users ) {
			var user = this.props.state.users[id].User
			if ( user.Name === this.props.state.vars.member ) {
				validUser = true
				break;
			}
		}
		if ( validUser === false ) {
			doDefault = true
		}
		if ( doDefault === true ) {
			this.props.state.hasher.set({member: this.props.state.user.name})
		}
	}
	render() {
		return (
			<div className="members">
			</div>
		);
	}
}

export default Members
