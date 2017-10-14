import React, { Component } from 'react';

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
			rval.push(<option user-id={"u-" + user.ID} key={uid} value={user.Name}>{user.DisplayName}</option>)
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
					<select
						onChange={this.userClick}
						className="form-control"
						id="users"
						style={{height: "3em"}}
						defaultValue={this.props.state.vars.member}>
						{this.users()}
					</select>
				</div>
			</form>
		)
	}
}

export default MembersNav
