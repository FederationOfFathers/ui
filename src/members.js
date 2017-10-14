import React, { Component } from 'react';

class Xbox extends Component {
	render = () => {
		if ( this.props.id === "" ) {
			return null
		}
		return (
			<a className="btn btn-success mx-1" href={"https://account.xbox.com/en-US/Profile?GamerTag="+this.props.id} target="_blank">xbox</a>
		)
	}
}

class Mixer extends Component {
	render = () => {
		if ( this.props.id === "" ) {
			return null
		}
		return(
			<a href={"//mixer.com/" + this.props.id} target="_blank" className="btn btn-primary mx-1">mixer</a>
		)
	}
}

class Twitch extends Component {
	render = () => {
		if ( this.props.id === "" ) {
			return null
		}
		return(
			<a href={"https://go.twitch.tv/" + this.props.id} target="_blank" className="btn mx-1" style={{color: "white", backgroundColor:"#4B397A"}}>twitch</a>
		)
	}
}

class Member extends Component {
	componentDidMount = () => {
		this.setState({mounted: true})
	}
	componentWillMount = () => {
		this.setState({
			currentID: this.props.member.ID,
			mounted: false,
			fetch: false,
		})
	}
	componentDidUpdate = ( p ) => {
		if ( this.state.mounted === false ) {
			return
		}
		if ( this.state.currentID !== this.props.member.ID ) {
			this.setState({fetch: false, currentID: this.props.member.ID})
		}
		if ( this.state.fetch === false ) {
			this.fetch()
		}
	}
	fetch = () => {
		var now = new Date()
		this.setState({fetch: now.getTime()})
		this.props.state.api.user.streams.get(this.state.currentID)
			.then(function() {
				this.props.state.api.user.meta.get(this.state.currentID)
			}.bind(this))
			.catch(function() {
				this.setState({fetch: false})
			}.bind(this))
	}
	memberChannels = () => {
		var id = this.props.member.Name
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
			rval[i] = ( <span key={i} className="w-50 my-1 badge badge-light">{rval[i]}</span> )
		}
		return rval
	}
	links = () => {
		console.log(this.props.state.meta.streams)
		var s = this.props.state.meta.streams[this.props.member.ID]
		var mixer = null
		var twitch = null
		var xbox = (<Xbox id={this.props.member.GamerTag}/>)
		if ( typeof s !== "undefined" ) {
			if ( s.Twitch !== "" ) {
				twitch = ( <Twitch h={16} w={47} id={s.Twitch}/> )
			}
			if ( s.Beam !== "" ) {
				mixer = ( <Mixer id={s.Beam} h={16}/> )
			}
		}
		return(
			<div className="my-4 clearfix">
				{xbox}
				{twitch}
				{mixer}
			</div>
		)
	}
	render = () => {
		return (
			<div className="members">
				<div className="card">
					<div className="card-body">
						<h4 className="card-title">
							<img className="float-left mx-2" style={{width: '64px', height: '64px'}} alt="" src={this.props.member.Image}/>
							{this.props.member.Name}
						</h4>
						<h6 className="card-subtitle mb-2 text-muted">{this.props.member.DisplayName}</h6>
						{this.links()}
						<h5>Channels<br/>{this.memberChannels()}</h5>
					</div>
				</div>
			</div>
		);
	}
}

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
	render() {
		var user = this.member()
		if ( user === false ) {
			return null
		}
		return (<Member member={user} state={this.props.state}/>)
	}
}

export default Members
