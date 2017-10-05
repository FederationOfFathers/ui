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
	member = () => {
		if ( typeof this.props.state.vars.member === "undefined" ) {
			return false
		}
		for( var id in this.props.state.users ) {
			var user = this.props.state.users[id].User
			if ( user.Name === this.props.state.vars.member ) {
				return user
			}
		}
		return false
	}
	memberChannels = ( id ) => {
		var rval = []
		for ( var cid in this.props.state.chanList ) {
			var chan = this.props.state.chanList[cid]
			if ( chan.members.indexOf(id) >= 0 ) {
				rval.push("#" + chan.name )
			}
		}
		for ( var gid in this.props.state.groupList ) {
			var group = this.props.state.groupList[gid]
			if ( group.visible === "false" ) {
				var found = false
				for ( var mid in this.props.state.groups ) {
					if ( this.props.state.groups[mid].id === group.id ) {
						found = true
					}
				}
				if ( !found ) {
					continue
				}
				if ( group.members.indexOf(id) >= 0 ) {
					rval.push(group.name)
				}
			}
		}
		rval.sort(function(a,b) {
			if (a.substr(0, 1) === "#") {
				a = a.substr(1)
			}
			if (b.substr(0, 1) === "#") {
				b = b.substr(1)
			}
			if (a < b)
				return -1;
			if (a > b)
				return 1;
			return 0;
		})
		for ( var i in rval ) {
			rval[i] = ( <span key={chan.name} className="w-50 my-1 badge badge-light">{rval[i]}</span> )
		}
		return rval
	}
	render() {
		var user = this.member()
		if ( user === false ) {
			return null
		}
		return (
			<div className="members">
				<div className="card">
					<div className="card-body">
						<h4 className="card-title">
							<img className="float-left mx-2" style={{width: '64px', height: '64px'}} alt="" src={user.Image}/>
							{user.Name}
						</h4>
						<h6 className="card-subtitle mb-2 text-muted">{user.DisplayName}</h6>
						<h5>Channels<br/>{this.memberChannels(user.Name)}</h5>
					</div>
				</div>
			</div>
		);
	}
}

export default Members
