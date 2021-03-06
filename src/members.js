import React, { Component } from 'react';
import Member from './member'

class Members extends Component {
	defaultToMe = () => {
		var doDefault = false
		if ( typeof this.props.state.vars.member === "undefined" ) {
			doDefault = true
		} else if ( this.props.state.vars.member === "" ) {
			doDefault = true
		}
		var validUser = false
		for ( var id in this.props.state.users ) {
			var user = this.props.state.users[id]
			if ( user.name === this.props.state.vars.member ) {
				validUser = true
				break;
			}
		}
		if ( validUser === false ) {
			console.warn("Invalid user " + this.props.state.vars.member)
			doDefault = true
		}
		if ( doDefault === true ) {
			this.props.state.hasher.set({member: this.props.state.user.name})
		}
	}
	member = () => {
		if ( typeof this.props.state.vars.member === "undefined" ) {
			return false;
		}
		for( var id in this.props.state.users ) {
			var user = this.props.state.users[id]
			if ( user.User.Name === this.props.state.vars.member ) {
				// user.id = id;
				return user
			}
		}
		return false
	}
	render() {
		var user = this.member()
		if ( user === false ) {
			this.defaultToMe()
		}
		
		return (<Member member={user} state={this.props.state}/>)
	}
}

export default Members
