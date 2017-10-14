import React, { Component } from 'react';
import Xbox from './member-xbox'
import Mixer from './member-mixer'
import Twitch from './member-twitch'

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
		var s = this.props.state.meta.streams[this.props.member.ID]
		var mixer = ""
		var twitch = ""
		if ( typeof s !== "undefined" ) {
			twitch = s.Twitch
			mixer = s.Beam
		}
		return(
			<div className="btn-group btn-group-justified w-100">
				<Xbox id={this.props.member.GamerTag} state={this.props.state}/>
				<Twitch id={twitch} state={this.props.state}/>
				<Mixer id={mixer} state={this.props.state}/>
			</div>
		)
	}
	render = () => {
		return (
			<div className="members">
				<div className="card">
					<div className="card-body">
						<div className="clearfix">
							<h4 className="card-title">
								<img
									className="float-left mx-2 clearfix"
									style={{width: '64px', height: '64px'}}
									alt="" src={this.props.member.Image}/>
								{this.props.member.Name}
							</h4>
							<h6 className="card-subtitle mb-2 text-muted">
								{this.props.member.DisplayName}
							</h6>
						</div>
						<div className="py-1">
							{this.links()}
							<h5 className="my-1">Channels</h5>
							<div>
								<h5>{this.memberChannels()}</h5>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Member
