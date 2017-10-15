import React, { Component } from 'react';
import Xbox from './member-xbox'
import Mixer from './member-mixer'
import Twitch from './member-twitch'
import Channels from './member-channels'

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
							<Channels member={this.props.member} state={this.props.state}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Member
