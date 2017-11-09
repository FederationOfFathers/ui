import React, { Component } from 'react';
import Select from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

class MembersNav extends Component {
	users = () => {
		var users = []
		for ( var id in this.props.state.users ) {
			if ( this.props.state.users[id].User.ID === "" ) {
				continue
			}
			users.push(this.props.state.users[id].User)
		}
		users.sort(function(a,b) {
			if (a.DisplayName.toLowerCase() < b.DisplayName.toLowerCase())
				return -1;
			if (a.DisplayName.toLowerCase() > b.DisplayName.toLowerCase())
				return 1;
			return 0;
		})
		var rval = []
		for ( var uid in users ) {
			var user = users[uid]
			rval.push({label: user.DisplayName, value: user.Name})
		}
		return rval
	}
	userClick = (e) => {
		this.props.state.hasher.set({member: e.target.value})
	}
	render = () => {
		if ( this.props.state.vars.main !== "members" ) {
			return null
		}
		return (
			<form>
				<div className="form-group">
					<Select
						options={this.users()}
						id="users"
						onChange={(s)=>{if ( s === null ) { return } this.props.state.hasher.set({member: s.value})}}
						value={this.props.state.vars.member}/>
				</div>
			</form>
		)
	}
}

export default MembersNav
